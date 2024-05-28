document.querySelector("#btnPrecios").addEventListener("click", () => {
  factMostrarMenu();
});
let contenedor = document.querySelector("#factMenu");

function monetarizarMenu(valor) {
  if (valor < 1) {
    return "-";
  }
  valor = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
  return valor;
}

function factMostrarMenu() {
  let items = "";
  categorias.forEach((categoria) => {
    let orden = productos.filter((prod) => prod.categoria == categoria.categoria);
    if (orden.length > 0) {
      items += `<tr><td colspan="6" class="tablaCategoria">${categoria.categoria}</td></tr>`;
      orden.forEach((item) => {
        let botones = `<span class="menuAgregar factBotonRapidoMenu" data-codigo="${item.codigo}" data-cantidad="1">+1</span>`;
        if (item.fraccionamiento == "docena") {
          botones = `<span class="menuAgregar factBotonRapidoMenu" data-codigo="${item.codigo}" data-cantidad="1">+1</span><span class="menuAgregar factBotonRapidoMenu" data-codigo="${item.codigo}" data-cantidad="6">+6</span><span class="menuAgregar factBotonRapidoMenu" data-codigo="${item.codigo}" data-cantidad="12">+12</span>`;
        }
        if (item.fraccionamiento == "kilo") {
          botones = `<span class="menuAgregar factBotonRapidoMenu" data-codigo="${item.codigo}" data-cantidad="250">+0.25</span><span class="menuAgregar factBotonRapidoMenu" data-codigo="${item.codigo}" data-cantidad="500">+0.5</span><span class="menuAgregar factBotonRapidoMenu" data-codigo="${item.codigo}" data-cantidad="1000">+1</span>`;
        }
        if (item.estado == "true") {
          items += `<tr>
                        <td>${item.codigo}</td>
                        <td>${item.nombre}</td>
                        <td class="importe">${monetarizarMenu(item.preciounidad)}</td>
                        <td class="importe">${monetarizarMenu(item.preciodocena)}</td>
                        <td class="importe">${monetarizarMenu(item.preciokilo)}</td>
                        <td class="botoneraFact">${botones}</td>
                    </tr>`;
        }
      });
    }
  });
  contenedor.style.display = "flex";
  let contenido = `<div id="menuCerrar">X</div>
  <div id="menu">
    <h1>Productos</h1>
    <table>
        <thead>
            <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Precio Unidad</th>
                <th>Precio Docena</th>
                <th>Precio Kilo</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${items}
        </tbody>
    </table>
</div>`;
  contenedor.innerHTML = contenido;

  document.querySelectorAll(".factBotonRapidoMenu").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      cargarBotonRapido(e);
      factCerrarMenu();
    });
  });

  document.querySelector("#menuCerrar").addEventListener("click", () => {
    factCerrarMenu();
  })
}

function factCerrarMenu() {
  contenedor.style.display = "none";
}
