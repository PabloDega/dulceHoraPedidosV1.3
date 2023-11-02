import { agregarCard, asignarEventListener } from "./script.js";
import { agregarLimpiar } from "./calculos.js";

// Constructor card SlideH
function constCard(dato, salida) {
  let nombre;
  let precio;
  if (dato.fraccionamiento == "Docena") {
    nombre = "Docena de " + dato.nombre;
    precio = dato.precioDocena;
  } else {
    nombre = dato.nombre;
    precio = dato.precio;
  }
  let promo = "";
  let orden = "";
  if (dato.destacado == "true") {
    promo =
      '<div class="cardPromo"><img src="im/star.svg" alt="">TOP VENTAS</div>';
    orden = "style=order:-1";
  }
  salida.innerHTML += `
    <div class="card" id="promo" ${orden}>
        ${promo}
        <div class="cardImg"><img src="${dato.imgCard}" alt=""></div>
        <div class="cardCont">
        <p class="cardDesc">${nombre}</p>
        <p class="cardDetalle">${dato.variedad}</p>
        <div class="cardPrecio"><span>$${precio}</span><div class="cardAdd pointer" data-id="${dato.id}">+</div></div>
        </div>
    </div>`;
}
// Constructor agregar Items
function abrirSelector(e) {
  let dataId = e.target.dataset.id;
  agregarCard.style.display = "flex";
  let itemAgregar = prodActivos.find((prod) => prod.id == dataId);
  if(typeof(itemAgregar.variedad) !== "object"){
    itemAgregar.variedad = itemAgregar.variedad.split(",");
  }
  let botonesDocena = "";
  function varHypen(variedad) {
    if (typeof variedad === "object") {
      variedad = variedad[0]
      variedad = variedad.trim()
      return variedad.replace(/ /g, "_");
    }
    variedad = variedad.trim()
    return variedad.replace(/ /g, "_");
  }
  let part1, part2, part3;
  part1 = `
    <div class="agregarCard">
      <div class="cardImg"><img src="${itemAgregar.imgCard}" alt="imagen de referencia"></div>
      <div class="agregarSeleccion">
          <h1>${itemAgregar.nombre}</h1>`;
  if (itemAgregar.variedad.length > 1) {
    part2 = `<h3>Seleccionar Variedad</h3><div class="agregarVariedad">`;
    itemAgregar.variedad.forEach((variedad) => {
      let variedadHypen = varHypen(variedad);
      if (itemAgregar.fraccionamiento == "Docena") {
        botonesDocena = `<span class="agregar6" data-cantidad="6" 
        data-prod="${variedadHypen}"
        data-id="${dataId}">+6</span>
        <span class="agregar12" data-cantidad="12"
        data-prod="${variedadHypen}"
        data-id="${dataId}">+12</span>`;
      }
      part2 += `
              <div>
                  <span>${variedad}</span>
                  <span class="agregarMenos pointer" data-cantidad="-1" data-prod="${variedadHypen}" data-id="${dataId}">-</span>
                  <input type="number" name="${variedadHypen}" id="${variedadHypen}" value="0" min="0" max="999">
                  <span class="agregarMas pointer" data-cantidad="1" data-prod="${variedadHypen}" data-id="${dataId}">+</span>
                  ${botonesDocena}
              </div>`;
    });
  } else {
    let variedadHypen = varHypen(itemAgregar.variedad[0]);
    if (itemAgregar.fraccionamiento == "Docena") {
      botonesDocena = `
      <span class="agregar6" data-cantidad="6"
      data-prod="${variedadHypen}"
      data-id="${dataId}">+6</span>
      <span class="agregar12" data-cantidad="12"
      data-prod="${variedadHypen}"
      data-id="${dataId}">+12</span>`;
    }
    part2 = `<h3>Seleccionar</h3><div class="agregarVariedad">
              <div>
                  <span>${itemAgregar.variedad}</span>
                  <span class="agregarMenos pointer" data-cantidad="-1" data-prod="${variedadHypen}" data-id="${dataId}">-</span>
                  <input type="number" name="${variedadHypen}" id="${variedadHypen}" value="0">
                  <span class="agregarMas pointer" data-cantidad="1" data-prod="${variedadHypen}" data-id="${dataId}">+</span>
                  ${botonesDocena}
              </div>`;
  }
  part3 = `
              <div>
                  <span class="agregarBotones pointer" id="agregarBotonLimpiar">Limpiar</span>
              </div>
              <div class="agregarPrecios">
                  <span>Cantidad total</span>
                  <span id="agregarCantTotal">0</span>
                  <span id="agregarPrecio">$0</span>
              </div>
              <div>
                * pedido sujeto a disponibilidad
              </div>
              <div>
                  <span class="agregarBotones pointer" id="agregarBotonCarrito" data-id="${dataId}">Agregar al carrito</span>
              </div></div></div></div>
              <div id="agregarCerrar" class="pointer">Cancelar</div>`;
  agregarCard.innerHTML = part1 + part2 + part3;
  asignarEventListener();
}
// Cerrar agregaraitems
function cerrarAgregar() {
  agregarCard.style.display = "none";
  agregarLimpiar();
}

// Constructor SlideH de Categorias
function creadorSlideH2() {
  let salida = document.querySelector("#slideH2");
  salida.innerHTML = "";
  prodActivos.forEach((dato) => {
    if (dato.categoria == this.dataset.categoria) {
      constCard(dato, salida);
    }
  });
  asignarEventListener();
}

  //-- funcionalidad a botones
document.querySelectorAll(".categoria").forEach((boton) => boton.addEventListener("click", creadorSlideH2));


export {
  constCard,
  abrirSelector,
  cerrarAgregar,
  creadorSlideH2,
  // creadorCategorias,
};
