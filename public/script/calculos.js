import {
  pedido,
  agregarCard,
  agregarCantTotal,
  agregarPrecio,
} from "./script.js";

let cantProds = document.querySelector("#cantItems");
let inputs = document.getElementsByTagName("input");

function contador() {
  if (cantProds != null) {
    if (pedido.length > 9) {
      cantProds.style =
        "background-color: black;border-radius: 50%;padding: 3px;left: 8px;color:white;";
    }
    cantProds.innerHTML = pedido.length;
  }
}
// Calucla cantidad para renderizar
function agregarSuma(e) {
  let prod = e.srcElement.dataset.prod;
  let input = document.querySelector("#" + prod);
  let cant = parseInt(e.srcElement.dataset.cantidad);
  let suma = parseInt(input.value) + cant;
  if (suma >= 0) {
    input.value = suma;
    agregarTotal(cant, e.srcElement.dataset.id);
  }
}
// Calcula cantidad de items en agregarCard
function agregarTotal(cant, id) {
  let suma = parseInt(agregarCantTotal.innerHTML) + cant;
  if (suma >= 0) {
    agregarCantTotal.innerHTML = suma;
    agreagrPrecio(suma, id);
  }
}
// Calcula precio en agregarCard
function agreagrPrecio(suma, id) {
  let producto = window.prodActivos.find((prod) => prod.id == id);
  if (producto.fraccionamiento == "Docena") {
    let docenas = parseInt(suma / 12);
    let resto = suma % 12;
    agregarPrecio.innerHTML =
      "$" + (producto.precioDocena * docenas + producto.precio * resto);
  } else {
    agregarPrecio.innerHTML = "$" + producto.precio * suma;
  }
}
// Limpieza de salida en agregarCard
function agregarLimpiar() {
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = 0;
  }
  agregarCantTotal.innerHTML = 0;
  agregarPrecio.innerHTML = "$0";
}
// Agragar items a pedido
function agregarConfimar(e) {
  let id = e.srcElement.dataset.id
  let cantidad = agregarCantTotal.innerHTML;
  if (cantidad > 0) {
    let orden = pedido.length;
    let precio = agregarPrecio.innerHTML;
    let detalle = [];
    for (let i = 0; i < inputs.length; i++) {
      detalle[i] = [inputs[i].name, inputs[i].value];
    }
    pedido[orden] = [orden, id, detalle, precio, cantidad];
    localStorage.setItem("pedido", JSON.stringify(pedido));
    orden++;
    agregarLimpiar();
    contador();
    nuevoItemCart()
  }
  agregarCard.style.display = "none";
}

function nuevoItemCart(){
  // agregar animacion al carrito
  document.querySelector("#cart").classList.add("nuevoItemCart");
  setTimeout(() => {
    document.querySelector("#cart").classList.remove("nuevoItemCart");
  }, 1000)
}

export {
  contador,
  agregarSuma,
  agregarTotal,
  agregarPrecio,
  agregarLimpiar,
  agregarConfimar,
};
