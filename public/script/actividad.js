let full = false;
if (window.location.pathname.split("/")[2] === "actividadToda") {
  full = true;
}
// toggle filter bar
let barraFiltrar = document.querySelector("#actividadFiltrosTabla");
let btnFiltrar = document.querySelector("#actividadFiltros");
btnFiltrar.addEventListener("click", () => {
  barraFiltrar.style.display = "table-row";
  btnFiltrar.style.display = "none";
});
document.querySelector("#actividadQuitarFiltros").addEventListener("click", () => {
  window.location.reload();
});
// Filtrar datos en cliente
let tabla = document.querySelector("#actividadTbody");
if (full) {
  let local = document.querySelector("table #local");
  local.addEventListener("change", (e) => {
    filtrar("local", e.target.value);
  });
}

let pedido = document.querySelector("table #pedido");
pedido.addEventListener("change", (e) => {
  filtrar("pedido", e.target.value);
});
let usuario = document.querySelector("table #usuario");
usuario.addEventListener("change", (e) => {
  filtrar("user", e.target.value);
});
let accion = document.querySelector("table #accion");
accion.addEventListener("change", (e) => {
  filtrar("accion", e.target.value);
});

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
  if (full) {
    local.innerHTML = "";
    filtroLocal.forEach((dato) => {
      local.innerHTML += `<option value="${dato}">${dato}</option>`;
    });
  }

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
