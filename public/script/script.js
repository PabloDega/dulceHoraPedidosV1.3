//--Funciones iniciales--

//--Asignacion de variables
let i = 0;
let agregarCantTotal;
let agregarPrecio;
let pedido = [];
let agregarCard = document.querySelector("#popScreen");

function abrirCarrito() {
  if (pedido.length > 0) {
    let pedidoLocal = localStorage.getItem("pedido");
    document.cookie = `pedido = ${pedidoLocal}`
    window.location.href = "./carrito";
  }
}

//--Funciones de inicio
//carga pedido guardado en localstorage
if (localStorage.getItem("pedido") !== null) {
  let pedidoLocal = localStorage.getItem("pedido");
  pedido = JSON.parse(pedidoLocal);
  calculos.contador();
}

//--Eventos--

//asignar eventos a botones
function asignarEventListener() {
  document.querySelectorAll(".cardAdd").forEach((boton) => {
    boton.addEventListener("click", constructores.abrirSelector);
  });
  if (document.querySelector("#agregarBotonLimpiar") != null) {
    document
      .querySelector("#agregarBotonLimpiar")
      .addEventListener("click", calculos.agregarLimpiar);
  }
  if (document.querySelector("#agregarBotonCarrito") != null) {
    document
      .querySelector("#agregarBotonCarrito")
      .addEventListener("click", calculos.agregarConfimar);
  }
  if (document.querySelector("#agregarBotonCompra") != null) {
    document
      .querySelector("#agregarBotonCompra")
      .addEventListener("click", calculos.agregarConfimar);
  }
  document
    .querySelectorAll(".agregarMenos, .agregarMas, .agregar6, .agregar12")
    .forEach((boton) => {
      boton.addEventListener("click", calculos.agregarSuma);
    });
  if (document.querySelector("#agregarCerrar") != null) {
    document
      .querySelector("#agregarCerrar")
      .addEventListener("click", constructores.cerrarAgregar);
  }
  if (document.querySelector("#pedidoActivo") != null) {
    document
      .querySelector("#pedidoActivo")
      .addEventListener("click", () => window.location.href = "./pedido");
  }
  agregarCantTotal = document.querySelector("#agregarCantTotal");
  agregarPrecio = document.querySelector("#agregarPrecio");
  if (document.querySelector("#cart") != null) {
    document.querySelector("#cart").addEventListener("click", abrirCarrito);
  }
  if (document.querySelector("#headerCambiar") != null) {
  document.querySelector("#headerCambiar").addEventListener("click", () => {
    localStorage.removeItem("pedido");
    window.location.href = "/volver";
  })}
  if (document.querySelector("#graciasInicio") != null) {
    document
      .querySelector("#graciasInicio")
      .addEventListener("click", () => window.location.href = "/");
  }
}

//--Pasos--
if(document.querySelector("#pasos") != null){
  let pasos = document.querySelector("#pasos");
  let ancho = pasos.offsetWidth;
  window.addEventListener("resize", () => {
    pasos.style.scrollBehavior = "auto";
    pasos.scrollLeft = pasos.offsetWidth * i;
    pasos.style.scrollBehavior = "smooth";
  });
  
  let tiempo = setInterval(mover, 2500);
  
  function mover() {
    pasos.scrollBy(ancho, 0);
    i++;
    if (i > 2) {
      clearInterval(tiempo);
    }
  }
}

asignarEventListener();

// agregar caducidad al pedido en localstorage o en plataforma de compra verificar existencias
// leer modificacion manual input agregar prods, no registra cantidad

export {
  agregarCard,
  asignarEventListener,
  pedido,
  agregarCantTotal,
  agregarPrecio,
};

import * as constructores from "./constructores.js";

import * as calculos from "./calculos.js";