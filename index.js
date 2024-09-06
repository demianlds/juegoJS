let preguntas_aleatorias = true;
let mostrar_pantalla_juego_términado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;

let juego_terminado = false;

window.onload = function () {
  base_preguntas = readText("database.json");
  interprete_bp = JSON.parse(base_preguntas);
  iniciarJuego();
};

let pregunta;
let posibles_respuestas;
let btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4")
];
let npreguntas = [];
let preguntas_hechas = 0;
let preguntas_correctas = 0;

let segundos = 10;
let intervalo;

function iniciarJuego() {
  juego_terminado = false;
  preguntas_hechas = 0;
  preguntas_correctas = 0;
  npreguntas = [];
  escogerPreguntaAleatoria();
}

function actualizar() {
  clearInterval(intervalo);
  segundos = 10;
  select_id('countdown').innerHTML = segundos;
  intervalo = setInterval(() => {
    if (segundos == 0) {
      segundos = 10;
      escogerPreguntaAleatoria();
    }
    select_id('countdown').innerHTML = segundos;
    segundos--;
  }, 1000);
}

function escogerPreguntaAleatoria() {
  if (juego_terminado) return;

  actualizar(); // Reiniciar el temporizador al escoger una nueva pregunta

  let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }
  if (n >= interprete_bp.length) {
    n = 0;
  }
  if (npreguntas.length == 10) {
    if (mostrar_pantalla_juego_términado) {
      swal.fire({
        title: "Juego finalizado",
        text: "Puntuación: " + preguntas_correctas + "/" + (preguntas_hechas),
        icon: "success",
        confirmButtonText: 'Reiniciar',
      }).then((result) => {
        if (result.isConfirmed) {
          iniciarJuego();
        }
      });
    }
    clearInterval(intervalo);
    juego_terminado = true;
    return;
  }

  npreguntas.push(n);
  preguntas_hechas++;
  n++;
  escogerPregunta(n);
}

function escogerPregunta(n) {
  pregunta = interprete_bp[n];
  select_id("categoria").innerHTML = pregunta.categoria;
  select_id("pregunta").innerHTML = pregunta.pregunta;
  select_id("numero").innerHTML = n;
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas - 1);
  } else {
    select_id("puntaje").innerHTML = "";
  }

  style("imagen").objectFit = pregunta.objectFit;
  desordenarRespuestas(pregunta);
  if (pregunta.imagen) {
    select_id("imagen").setAttribute("src", pregunta.imagen);
    style("imagen").height = "200px";
    style("imagen").width = "100%";
  } else {
    style("imagen").height = "0px";
    style("imagen").width = "0px";
    setTimeout(() => {
      select_id("imagen").setAttribute("src", "");
    }, 500);
  }
}

function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3,
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];
}

let suspender_botones = false;

function oprimir_btn(i) {
  if (suspender_botones || juego_terminado) return;

  suspender_botones = true;
  if (posibles_respuestas[i] == pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "lightgreen";
  } else {
    btn_correspondiente[i].style.background = "pink";
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == pregunta.respuesta) {
      btn_correspondiente[j].style.background = "lightgreen";
      break;
    }
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 1000);
}

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "white";
  }
  escogerPreguntaAleatoria();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}
