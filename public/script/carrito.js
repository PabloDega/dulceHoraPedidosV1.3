let pedido = [];
let cantProds = document.querySelector("#cantItems");
let precioTotal = 0;
let datosJson;
let cardRender = document.querySelector("#cardRender");
let totalCarrito = document.querySelector("#totalCarrito");
let popScreen = document.querySelector("#popScreen");
document
  .querySelector("#vaciarCarrito")
  .addEventListener("click", popVaciar);

// parse cookie
function parseCookiePedido(){
let cookiePedido = document.cookie;
cookiePedido = cookiePedido.split("=")
cookiePedido = JSON.parse(cookiePedido[1])
}
parseCookiePedido();

//carga pedido guardado en localstorage
function inicioCarrito() {
  if (localStorage.getItem("pedido") !== null) {
    // let pedidoLocal = localStorage.getItem("pedido");
    pedido = cookiePedido;
    contador();
  }
  function contador() {
    if (pedido.length > 9) {
      cantProds.style =
        "background-color: black;border-radius: 50%;padding: 3px;left: 8px;color:white;";
    }
    cantProds.innerHTML = pedido.length;
  }
  if (pedido.length == 0) {
    window.location.href = "../";
  }
}

// Selectores y Eventos
document.querySelectorAll(".cardProdEliminar").forEach((boton) => {
  boton.addEventListener("click", popEliminar);
});
document.querySelector("#cardProdConfirmar").addEventListener("click", enviarPedido);
document.querySelector("#cardProdSeguir").addEventListener("click", () => {
  window.location.href = "/pedidos"
})

// Renderiza el total
function totalRender() {
  totalCarrito.innerHTML = "$" + precioTotal;
}
// Pop eliminar Item
function popEliminar(e) {
  popScreen.style.display = "block";
  popScreen.innerHTML = `
  <div id="cardEliminar">
    <span>
      Esta acción eliminará el item de su carrito de compras.
      <span>
          <div id="cardEliminarOk" class="pointer" data-idpedidoeliminar="${e.target.dataset.idpedidoeliminar}">Eliminar</div>
          <div id="cardEliminarCancelar" class="pointer">Cancelar</div>
      </span>
    </span>
  </div>`;
  document
    .querySelector("#cardEliminarOk")
    .addEventListener("click", carritoEliminarItem);
  document
    .querySelector("#cardEliminarCancelar")
    .addEventListener("click", carritoEliminarCerrar);
}
// Eliminar Item
function carritoEliminarItem(e) {
  let pedidoLocal = JSON.parse(localStorage.getItem("pedido"));
  pedidoLocal.splice(e.target.dataset.idpedidoeliminar, 1);
  localStorage.setItem("pedido", JSON.stringify(pedidoLocal));
  window.location.href = "/carrito/eliminar/"+e.target.dataset.idpedidoeliminar;
}
// Cerrar pop Eliminar
function carritoEliminarCerrar() {
  popScreen.style.display = "none";
  popScreen.innerHTML = "";
}
// Pop Vaciar Carrito
function popVaciar() {
  popScreen.style.display = "block";
  popScreen.innerHTML = `
  <div id="cardEliminar">
    <span>
      Esta acción eliminará todos los items de su carrito de compras.
      <span>
          <div id="cardVaciarOk" class="pointer">Eliminar</div>
          <div id="cardVaciarCancelar" class="pointer">Cancelar</div>
      </span>
    </span>
  </div>`;
  document
    .querySelector("#cardVaciarOk")
    .addEventListener("click", vaciarCarrito);
  document
    .querySelector("#cardVaciarCancelar")
    .addEventListener("click", carritoEliminarCerrar);
}
// Vaciar carrito
function vaciarCarrito() {
  localStorage.setItem("pedido", "[]");
  // inicioCarrito();
  window.location.href = "/carrito/vaciar"
}
// Actualizar Carrito
function actualizarCarrito() {
  if (localStorage.getItem("pedido") !== null) {
    let pedidoLocal = localStorage.getItem("pedido");
    pedido = JSON.parse(pedidoLocal);
  }
}
actualizarCarrito();
// Enviar Pedido
function enviarPedido() {
  localStorage.clear();
  // window.location.href = "/pedido"
  /* fetch("/pedido", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(localStorage.getItem("pedido")),
  }).then(localStorage.clear()); */
}

document.querySelector("#headerCambiar").addEventListener("click", () => {
  localStorage.removeItem("pedido");
  window.location.href = "/volver";
})