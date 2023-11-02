if (document.querySelector("#chatSend") != null) {
  const chatForm = document.querySelector("#chatSend");
  const chatMensaje = document.querySelector("#chatInput");
  const chatEmisor = document.querySelector("#chatEmisor");
  const chatNombre = document.querySelector("#chatNombre");

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("envioMensaje", {
      mensaje: chatMensaje.value,
      emisor: chatEmisor.value,
      nombre: chatNombre.value,
      pedidoNumero: window.pedidoNumero,
      localId: window.localId || window.local.id,
      ring: window.ring,
      usuario: window.usuario,
      finalizar: false,
    });
    chatMensaje.value = "";
  });
}

const chatMensajes = document.querySelector(".chatMensajes");
const chatAgregarMensaje = (datos) => {
  chatMensajes.innerHTML += `<div class="chatMensaje" id="${datos.emisor}">
        <span class="chatMensajeFecha">${new Date(datos.fecha).toLocaleString()}</span>
        <span><b>${datos.nombre}:</b> ${datos.mensaje}</span>
    </div>`;
  if (datos.finalizar) {
    chatMensajes.innerHTML += `<div id="cerrarPedidoChat" class="btn btnChat">Cerrar pedido</div>`;
    document.querySelectorAll("#cerrarPedidoChat").forEach((boton) => {
      boton.addEventListener("click", () => {
        confirmaEliminar();
      });
    });
  }
};

const chatAgregarMensajeBot = (datos) => {
  chatMensajes.innerHTML += `<div class="chatMensaje" id="${datos.emisor}">
        <span class="chatMensajeFecha">${new Date(datos.fecha).toLocaleString()}</span>
        <span>${datos.mensaje}</span>
    </div>`;
};

// Cargar nombre de cliente

const pedidoBtnCargar = () => {
  document.querySelector("#pedidoBtnCargar").addEventListener("click", () => {
    cargarNombre();
  });
  document.querySelector("#nombreCliente").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      cargarNombre();
    }
  });
};

const cargarNombre = () => {
  const nombreCliente = document.querySelector("#nombreCliente");
  chatNombre.value = nombreCliente.value;
  document.querySelector(
    ".pedidoNombreUsuario"
  ).innerHTML = `<span>Gracias ${nombreCliente.value}</span><div class="pedidoBtn" id="pedidoBtnCambiar">Cambiar</div>`;
  pedidoBtnCambiar();
};

const pedidoBtnCambiar = () => {
  document.querySelector("#pedidoBtnCambiar").addEventListener("click", () => {
    document.querySelector(".pedidoNombreUsuario").innerHTML = `<span>Tu nombre (opcional)</span>
    <input type="text" name="nombreCliente" id="nombreCliente">
    <div class="pedidoBtn" id="pedidoBtnCargar">Cargar</div>`;
    pedidoBtnCargar();
  });
};

if (document.querySelector("#pedidoBtnCargar") != null) {
  pedidoBtnCargar();
}
// funcion cancelar pedido
if (document.querySelector("#pedidoCancelar") != null) {
  document.querySelector("#pedidoCancelar").addEventListener("click", () => {
    confirmaEliminar();
  });
}
function confirmaEliminar() {
  let popScreen = document.querySelector("#popScreen");
  popScreen.style.display = "block";
  popScreen.innerHTML += `<div id="cortina">
    <div id="confirmarEliminar">
      Está por finalizar su pedido. Esta acción no se puede deshacer. Desea
      continuar?
      <div class="btn btnNaranja" id="btnEliminar">Confirmar</div>
      <div class="btn btnRojo" id="btnEliminarCancelar">Cancelar</div>
    </div>
  </div>`;
  document
    .querySelector("#btnEliminar")
    .addEventListener("click", () => (window.location.href = "./pedido/cancelar"));
  document
    .querySelector("#btnEliminarCancelar")
    .addEventListener("click", () => cerrarPopEliminar());
}
function cerrarPopEliminar() {
  let popScreen = document.querySelector("#popScreen");
  popScreen.style.display = "none";
  popScreen.innerHTML = "";
}

// Funcion pagar con MP

if (document.querySelector("#pedidoPagarMP") != null) {
  document.querySelector("#pedidoPagarMP").addEventListener("click", () => {
    window.open("https://link.mercadopago.com.ar/pablodega", "_blank");
  });
}
