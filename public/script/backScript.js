// Eventos menu
if (document.querySelector("#facturacionLocalGastos") != null) {
  document
    .querySelector("#facturacionLocalGastos")
    .addEventListener("click", () => (location.href = "/panel/facturacion/registros/gastos"));
}
if (document.querySelector("#facturacionLocalCierreCaja") != null) {
  document
    .querySelector("#facturacionLocalCierreCaja")
    .addEventListener("click", () => (location.href = "/panel/local/caja/cierre"));
}
if (document.querySelector("#facturacionLocalProdPropios") != null) {
  document
    .querySelector("#facturacionLocalProdPropios")
    .addEventListener("click", () => (location.href = "/panel/facturacion/local/productos/personalizados"));
}
if (document.querySelector("#pedidos") != null) {
  document
    .querySelector("#pedidos")
    .addEventListener("click", () => (location.href = "/panel/pedidos"));
}
if (document.querySelector("#stock") != null) {
  document
    .querySelector("#stock")
    .addEventListener("click", () => (location.href = "/panel/stock"));
}
if (document.querySelector("#actividad") != null) {
  document
    .querySelector("#actividad")
    .addEventListener("click", () => (location.href = "/panel/actividad"));
}
if (document.querySelector("#verProductosFabrica") != null) {
  document.querySelector("#verProductosFabrica").addEventListener("click", () => (location.href = "/panel/productosFabrica"));
}
if (document.querySelector("#verCategoriaFabrica") != null) {
  document
    .querySelector("#verCategoriaFabrica")
    .addEventListener("click", () => (location.href = "/panel/categoriasFabrica"));
}
if (document.querySelector("#backListaProdEditar") != null) {
  document
    .querySelectorAll("#backListaProdEditar")
    .forEach((boton) =>
      boton.addEventListener(
        "click",
        (e) => (location.href = "/panel/productos/editar?id=" + e.target.dataset.id)
      )
    );
}
if (document.querySelector("#backListaProdEliminar") != null) {
  document
    .querySelectorAll("#backListaProdEliminar")
    .forEach((boton) => boton.addEventListener("click", (e) => confirmaEliminar(e.target.dataset)));
}
if (document.querySelector("#backListaCatEditar") != null) {
  document
    .querySelectorAll("#backListaCatEditar")
    .forEach((boton) =>
      boton.addEventListener(
        "click",
        (e) => (location.href = "/panel/categorias/editar?id=" + e.target.dataset.id)
      )
    );
}
if (document.querySelector("#backListaCatEliminar") != null) {
  document
    .querySelectorAll("#backListaCatEliminar")
    .forEach((boton) => boton.addEventListener("click", (e) => confirmaEliminar(e.target.dataset)));
}
if (document.querySelector("#backListaLocalEditar") != null) {
  document
    .querySelectorAll("#backListaLocalEditar")
    .forEach((boton) =>
      boton.addEventListener(
        "click",
        (e) => (location.href = "/panel/local/editar?id=" + e.target.dataset.id)
      )
    );
}
if (document.querySelector("#backListaLocalFiscal") != null) {
  document
    .querySelectorAll("#backListaLocalFiscal")
    .forEach((boton) =>
      boton.addEventListener(
        "click",
        (e) => (location.href = "/panel/local/fiscal?id=" + e.target.dataset.id)
      )
    );
}
if (document.querySelector("#backListaLocalEliminar") != null) {
  document
    .querySelectorAll("#backListaLocalEliminar")
    .forEach((boton) => boton.addEventListener("click", (e) => confirmaEliminar(e.target.dataset)));
}
if (document.querySelector("#nuevoLocal") != null) {
  document
    .querySelector("#nuevoLocal")
    .addEventListener("click", () => (location.href = "/panel/local/nuevo"));
}
if (document.querySelector("#verLocales") != null) {
  document
    .querySelector("#verLocales")
    .addEventListener("click", () => (location.href = "/panel/local"));
}if (document.querySelector("#verServicios") != null) {
  document
    .querySelector("#verServicios")
    .addEventListener("click", () => (location.href = "/panel/servicios"));
}if (document.querySelector("#nuevoServicio") != null) {
  document
    .querySelector("#nuevoServicio")
    .addEventListener("click", () => (location.href = "/panel/servicios/nuevo "));
}
if (document.querySelector("#backListaServEliminar") != null) {
  document
    .querySelectorAll("#backListaServEliminar")
    .forEach((boton) => boton.addEventListener("click", (e) => confirmaEliminar(e.target.dataset)));
}
if (document.querySelector("#verCategoria") != null) {
  document
    .querySelector("#verCategoria")
    .addEventListener("click", () => (location.href = "/panel/categorias"));
}
if (document.querySelector("#nuevaCategoria") != null) {
  document
    .querySelector("#nuevaCategoria")
    .addEventListener("click", () => (location.href = "/panel/categorias/nueva"));
}
if (document.querySelector("#nuevoProd") != null) {
  document
    .querySelector("#nuevoProd")
    .addEventListener("click", () => (location.href = "/panel/productos/nuevo"));
}
if (document.querySelector("#vistaCard") != null) {
  document
    .querySelector("#vistaCard")
    .addEventListener("click", () => (location.href = "/panel/productos/card"));
}
if (document.querySelector("#vistaTabla") != null) {
  document
    .querySelector("#vistaTabla")
    .addEventListener("click", () => (location.href = "/panel/productos/tabla"));
}
if (document.querySelector("#editProdFraccionamiento") != null) {
  document
    .querySelector("#editProdFraccionamiento")
    .addEventListener("change", (e) => editProdtoggleUnidad(e));
}
if (document.querySelector("#fotosProducto") != null) {
  document
    .querySelector("#fotosProducto")
    .addEventListener("click", () => (location.href = "/panel/fotos/productos"));
}
if (document.querySelector("#fotosCategorias") != null) {
  document
    .querySelector("#fotosCategorias")
    .addEventListener("click", () => (location.href = "/panel/fotos/categorias"));
}
if (document.querySelector("#fotosLocales") != null) {
  document
    .querySelector("#fotosLocales")
    .addEventListener("click", () => (location.href = "/panel/fotos/locales"));
}
if (document.querySelectorAll(".btnProductos") != null) {
  document.querySelectorAll(".btnProductos").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      location.href = "/panel/fotos/nueva?tipo=productos&id=" + e.target.dataset.id;
    })
  })
}
if (document.querySelectorAll(".btnNuevaFotoFabrica") != null) {
  document.querySelectorAll(".btnNuevaFotoFabrica").forEach((boton  ) => {
    boton.addEventListener("click", (e) => {
      // console.log(e.target.dataset.id)
      location.href = "/panel/productosFabrica/fotos/nueva?id=" + e.target.dataset.id;
    })
  })
}
if (document.querySelectorAll(".btnCategorias") != null) {
  document
    .querySelectorAll(".btnCategorias")
    .forEach((boton) =>
      boton.addEventListener(
        "click",
        (e) => (location.href = "/panel/fotos/nueva?tipo=categorias&id=" + e.target.dataset.id)
      )
    );
}
if (document.querySelectorAll(".btnLocales") != null) {
  document
    .querySelectorAll(".btnLocales")
    .forEach((boton) =>
      boton.addEventListener(
        "click",
        (e) => (location.href = "/panel/fotos/nueva?tipo=locales&id=" + e.target.dataset.id)
      )
    );
}
if (document.querySelectorAll(".mensajeErrorForm") != null) {
  document
    .querySelectorAll(".mensajeErrorForm")
    .forEach((boton) => boton.addEventListener("click", (e) => (e.target.style.display = "none")));
}
if (document.querySelector("#userIcon") != null) {
  document.querySelector("#userIcon").addEventListener("click", () => {
    let vista = document.querySelector("#cerrarSesion").style;
    if (vista.display == "none") {
      vista.display = "flex";
    } else {
      vista.display = "none";
    }
  });
}

if (document.querySelector("#cerrarSesionBtn") != null) {
  document
    .querySelector("#cerrarSesionBtn")
    .addEventListener("click", () => (location.href = "/login/logout"));
}

if (document.querySelector(".pedidosCard") != null) {
  document.querySelectorAll(".pedidosCard").forEach((boton) =>
    boton.addEventListener("click", (e) => {
      location.href = "/panel/pedidos?id=" + e.currentTarget.dataset.id;
    })
  );
}

if (document.querySelector(".pedidosProdCard") != null) {
  document.querySelectorAll(".pedidosProdCard").forEach((boton) =>
    boton.addEventListener("click", (e) => {
      document.querySelector("#cortinaLoad").style.display = "flex";
      let destino = "Local"
      if(e.currentTarget.dataset.lector == "fabrica"){destino = "fabrica"}
      location.href = "/panel/produccion/" + destino + "?id=" + e.currentTarget.dataset.id;
    })
  );
}
// Toggle precio de docena en editar/nuevo producto
function editProdtoggleUnidad(e) {
  /* let precioDocenaInput = document.querySelector("#preciodocena");
  let precioDocena = document.querySelector("#precioDoc");
  if (e.target.value == "Docena") {
    precioDocenaInput.style.display = "block";
  } else {
    precioDocenaInput.style.display = "none";
    precioDocena.value = "0";
  } */
  // console.log(e.target.value)
  let precioUnidad = document.querySelector("#preciounidad");
  let precioDocena = document.querySelector("#preciodocena");
  let precioKilo = document.querySelector("#preciokilo");
  if (e.target.value == "docena") {
    precioDocena.readOnly = false;
    precioKilo.readOnly = true;
    precioKilo.value = 0;
  } else if(e.target.value == "unidad"){
    precioUnidad.readOnly = false;
    precioKilo.readOnly = true;
    precioKilo.value = 0;
    precioDocena.readOnly = true;
    precioDocena.value = 0;
  } else if(e.target.value == "kilo"){
    precioKilo.readOnly = false;
    precioUnidad.readOnly = true;
    precioUnidad.value = 0;
    precioDocena.readOnly = true;
    precioDocena.value = 0;
  } else if(e.target.value == "kilo"){
    precioUnidad.readOnly = false;
    precioDocena.readOnly = false;
    precioKilo.readOnly = false;

  }
}
function editProdListaVariedad() {
  let lista = document.querySelector("#variedades");
  const span = document.createElement("span");
  span.className = "editProdItemVariedad";
  span.innerHTML =
    '<input type="text" name="variedad" id="variedad" placeholder="nueva variedad" />';
  lista.appendChild(span);
  editProdEventsListener();
}
// Funcion eliminar variedad en editar/nuevo producto
function editProdEliminarVariedad(e) {
  document.querySelector("#variedad" + e.target.dataset.id).remove();
}
// funcion eventos editar/nuevo producto
function editProdEventsListener() {
  if (document.querySelector("#editProdNuevaVariedad") != null) {
    document
      .querySelector("#editProdNuevaVariedad")
      .addEventListener("click", editProdListaVariedad);
  }
  if (document.querySelector("#editProdEliminarVariedad") != null) {
    document
      .querySelectorAll("#editProdEliminarVariedad")
      .forEach((boton) => boton.addEventListener("click", (e) => editProdEliminarVariedad(e)));
  }
}
editProdEventsListener();
// confirmar elimincacion
function confirmaEliminar(data) {
  let popScreen = document.querySelector("#popScreen");
  popScreen.innerHTML += `<div id="cortina">
  <div id="confirmarEliminar">
    Está por borrar un registro. Esta acción no se puede deshacer. Desea
    continuar?
    <div class="btn btnNaranja" id="btnEliminar">Confirmar</div>
    <div class="btn btnRojo" id="btnEliminarCancelar">Cancelar</div>
  </div>
</div>`;
  document
    .querySelector("#btnEliminar")
    .addEventListener(
      "click", () => {location.href = `/panel/${data.tipo}/eliminar?id=${data.id || data.usuario}`});
  document.querySelector("#btnEliminarCancelar").addEventListener("click", cerrarPopEliminar);
}

function cerrarPopEliminar() {
  let popScreen = document.querySelector("#popScreen");
  popScreen.innerHTML = "";
}
// Selector para checkbox de stock
if (document.querySelector(".fila") != null) {
  document.querySelectorAll("input[type=checkbox]").forEach((item) =>{
    item.addEventListener("change", (e)=>{
      let filaDestino = "#fila" + e.target.value;
      document.querySelector(filaDestino).classList.toggle("unchecked")
    });}
  );
}
// Activar y desactivar select de local en usuarios
  /* if (document.querySelector("#rolUser") != null) {
    document.querySelector("#rolUser").addEventListener("change", (e) => {
      if(e.target.value == "produccion"){
        document.querySelector("#localUser").disabled = true;
        document.querySelector("#localUserProduccion").disabled = false;
      } else {
        document.querySelector("#localUser").disabled = false;
        document.querySelector("#localUserProduccion").disabled = true;
      }
    })
  } */

// ocultar menu en modo supervisor, excepto en panel home
let vistaMenu = "flex";
if((window.location.pathname !== "/panel" && window.location.pathname !== "/login") && document.querySelector("#menuSupervisor")){
  let menu = document.querySelector("#menuSupervisor");
  let boton = document.querySelector("#backMenuShow");
  let cortina = document.querySelector("#cortina.fondoCortina")
  menu.style.display = "none";
  boton.style.display = "block";
  cortina.style.display = "none";
  menu.classList.add("menuFixed")
  boton.addEventListener("click", () => {
    if(menu.style.display == "none"){
      menu.style.display = "flex";
      cortina.style.display = "flex";
    } else {
      menu.style.display = "none";
      cortina.style.display = "none";
    }
  })
  cortina.addEventListener("click", () => {
      menu.style.display = "none";
      cortina.style.display = "none";
  })
}

if (document.querySelector("#pedidoProdNuevo") != null) {
  document.querySelector("#pedidoProdNuevo").addEventListener("click", () => {
    document.querySelector("#cortinaLoad").style.display = "flex";
    location.href = "/panel/produccion/nueva"
  });
}

if (document.querySelector("#verPedidosProduccion") != null) {
  document.querySelector("#verPedidosProduccion").addEventListener("click", () => {
    /* document.querySelectorAll(".pedidoProdentregado").forEach((card) => {
      card.style.display = "flex";
    }) */

    window.location.href = `/panel/produccion/${window.lector}/tabla`;
  });
}

if(document.querySelector("#pedidoProduccionModificar") != null){
  document.querySelector("#pedidoProduccionModificar").addEventListener("click", (e) => {
    document.querySelector("#cortinaLoad").style.display = "flex";
    location.href = "/panel/produccion/editar?id=" + e.target.dataset.id;
  })
}

if(document.querySelector("#nuevoProdFabrica") != null){
  document.querySelector("#nuevoProdFabrica").addEventListener("click", () => {
    location.href = "/panel/productosFabrica/nuevo";
  })
}

if (document.querySelector(".backListaProdFabricaEditar") != null) {
  document.querySelectorAll(".backListaProdFabricaEditar").forEach((boton) =>
    boton.addEventListener("click", (e) => {
      location.href = "/panel/productosFabrica/editar?id=" + e.currentTarget.dataset.id;
    })
  );
}

if (document.querySelector(".backListaProdFabricaEliminar") != null) {
  document
    .querySelectorAll(".backListaProdFabricaEliminar")
    .forEach((boton) => boton.addEventListener("click", (e) => confirmaEliminar(e.target.dataset)));
}

if(document.querySelector("#nuevaCategoriaFabrica") != null){
  document.querySelector("#nuevaCategoriaFabrica").addEventListener("click", () => {
    location.href = "/panel/categoriasFabrica/nueva";
  })
}

if (document.querySelector(".backListaCategoriaFabricaEditar") != null) {
  document.querySelectorAll(".backListaCategoriaFabricaEditar").forEach((boton) =>
    boton.addEventListener("click", (e) => {
      location.href = "/panel/categoriasFabrica/editar?id=" + e.currentTarget.dataset.id;
    })
  );
}

if (document.querySelector(".backListaCategoriaFabricaEliminar") != null) {
  document
    .querySelectorAll(".backListaCategoriaFabricaEliminar")
    .forEach((boton) => boton.addEventListener("click", (e) => confirmaEliminar(e.target.dataset)));
}

if (document.querySelector("#crearPedidoPesonalizado") != null) {
  document
    .querySelector("#crearPedidoPesonalizado")
    .addEventListener("click", () => {
      document.querySelector("#cortinaLoad").style.display = "flex";
      location.href = "/panel/produccion/personalizado/nuevo";
    });
}

if (document.querySelector("#formCancelado") != null) {
  document.querySelector("#formCancelado").addEventListener("submit", (e) => {
      e.preventDefault();
      
      // console.log("ping")
      confirmarEliminarProduccion(e);
  })
}

function confirmarEliminarProduccion(e){
  let popScreen = document.querySelector("#popScreen");
  popScreen.innerHTML += `<div id="cortina">
  <div id="confirmarEliminar">
    Está por borrar un registro. Esta acción no se puede deshacer. Desea
    continuar?
    <div class="btn btnNaranja" id="btnEliminar">Confirmar</div>
    <div class="btn btnRojo" id="btnEliminarCancelar">Cancelar</div>
  </div>
</div>`;
  document.querySelector("#btnEliminar").addEventListener("click", () => {
    popScreen.innerHTML = "";
    document.querySelector("#cortinaLoad").style.display = "flex";
    document.querySelector("#formCancelado").submit();
  }
    );
  document.querySelector("#btnEliminarCancelar").addEventListener("click", cerrarPopEliminar);
}

if (document.querySelector("#factFabRegistros") != null) {
  document
    .querySelector("#factFabRegistros")
    .addEventListener("click", () => (location.href = "/panel/facturacion/fabrica"));
}

if (document.querySelector("#factFabBotones") != null) {
  document
    .querySelector("#factFabBotones")
    .addEventListener("click", () => (location.href = "/panel/facturacion/fabrica/botones"));
}

if (document.querySelector("#factFabBotonesNuevo") != null) {
  document
    .querySelector("#factFabBotonesNuevo")
    .addEventListener("click", () => (location.href = "/panel/facturacion/fabrica/botones/nuevo"));
}
if (document.querySelector("#chatProduccionSend") != null) {
  document
    .querySelector("#chatProduccionSend").addEventListener("submit", () => {
      document.querySelector("#cortinaLoad").style.display = "flex";
    });
}
if (document.querySelector("#formAceptar") != null) {
  document.querySelector("#formAceptar").addEventListener("submit", () => {
      document.querySelector("#cortinaLoad").style.display = "flex";
    });
}
if (document.querySelector("#formEntregado") != null) {
  document.querySelectorAll("#formEntregado").forEach((boton) => {
    boton.addEventListener("submit", () => {
      document.querySelector("#cortinaLoad").style.display = "flex";
    })
  })
}
if (document.querySelector("#nuevoPedidoPersonalizado") != null) {
  document.querySelector("#nuevoPedidoPersonalizado").addEventListener("submit", () => {
      document.querySelector("#cortinaLoad").style.display = "flex";
    });
}
if (document.querySelector("#reportePlantaCategoriasEliminar") != null) {
  document.querySelectorAll("#reportePlantaCategoriasEliminar")
    .forEach((boton) => boton.addEventListener("click", (e) => confirmaEliminar(e.target.dataset)));
}