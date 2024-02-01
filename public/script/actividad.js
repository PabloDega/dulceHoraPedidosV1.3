let full = false;
if (window.location.pathname.split("/")[2] === "actividadToda") {
  full = true;
}
// toggle filter bar
document.querySelector("#actividadFiltrar").addEventListener("click", () => {
  document.querySelector("#cortina").style.display = "flex";
});
document.querySelector("#actividadCerrarFiltros").addEventListener("click", () => {
  document.querySelector("#cortina").style.display = "none";
});
document.querySelector("#actividadQuitarFiltros").addEventListener("click", () => {
  window.location.href = "/panel/actividadToda";
});
document.querySelector("#actividadAplicarFiltros").addEventListener("click", () => {
  document.querySelector("#actividadFiltros").submit();
});



// Filtrar datos en cliente
let tabla = document.querySelector("#actividadTbody");

function filtrar(tipo, valor) {
  let filtrado = data.filter((dato) => dato[tipo] == valor);
  if (filtrado.length == 0) {
    tabla.innerHTML = `<tr><td colspan="5">No se encontraron resultados<td></tr>`;
    return;
  }
  let contenidoNuevo = "";
  filtrado.forEach((dato) => {
    let fecha = new Date(dato.fecha);
    let datoLocal = ""
    if(full){
        datoLocal = `<td>${dato.local}</td>`
    }
    contenidoNuevo += `<tr>
            <td>${dato.id}</td>
            <td>${fecha.toLocaleString("es-AR")}</td>
            ${datoLocal}
            <td>${dato.pedido}</td>
            <td>${dato.user}</td>
            <td>${dato.accion}</td>
            <td>${dato.datos}</td>
        </tr>`;
  });
  tabla.innerHTML = contenidoNuevo;
  actualizarFiltros(filtrado);
  data = filtrado;
}

function actualizarFiltros(filtrado) {
  let filtroLocal = new Set();
  let filtroPedido = new Set();
  let filtroUsuarios = new Set();
  let filtroAccion = new Set();
  filtrado.forEach((dato) => {
    filtroPedido.add(dato.pedido);
    filtroUsuarios.add(dato.user);
    filtroAccion.add(dato.accion);
    filtroLocal.add(dato.local);
  });
  let query = window.location.search;
  local.innerHTML = "";
  filtroLocal.forEach((dato) => {
      local.innerHTML += `<option value="${dato}">${dato}</option>`;
  });
  pedido.innerHTML = "";
  filtroPedido.forEach((dato) => {
    pedido.innerHTML += `<option value="${dato}">${dato}</option>`;
  });
  usuario.innerHTML = "";
  filtroUsuarios.forEach((dato) => {
    usuario.innerHTML += `<option value="${dato}">${dato}</option>`;
  });
  accion.innerHTML = "";
  filtroAccion.forEach((dato) => {
    accion.innerHTML += `<option value="${dato}">${dato}</option>`;
  });
}

//Control de páginacion
let pagActual;
let pagTotal = Math.floor((window.filasTotal / 25) + 1)
if(window.page){
  pagActual = window.page;
} else {
  pagActual = 1;
}
let pagPrevBtn = document.querySelector("#prev");
let pagProxBtn = document.querySelector("#next");
document.querySelector("#paginadoInfo #act").innerHTML = pagActual;
document.querySelector("#paginadoInfo #tot").innerHTML = pagTotal;
document.querySelector("#pageNumero").value = pagActual;
// toggle botones
if(pagActual < 2){
  pagPrevBtn.style.display = "none";
}
if(pagActual >= pagTotal){
  pagProxBtn.style.display = "none";
}
// Eventos paginacion
pagPrevBtn.addEventListener("click", () => {
  document.querySelector("#pageNumero").value = parseInt(pagActual) - 1;
  document.querySelector("#actividadFiltros").submit();

})
pagProxBtn.addEventListener("click", () => {
  document.querySelector("#pageNumero").value = parseInt(pagActual) + 1;
  document.querySelector("#actividadFiltros").submit();
})


/* let query = new URLSearchParams(window.location.search);
let localSelected = query.get("local");
let usuarioSelected = query.get("usuario");
let accionSelected = query.get("accion");
let pageSelected = query.get("page");
 */