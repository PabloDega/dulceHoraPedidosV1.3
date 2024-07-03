function crearBotonesCategoria() {
    if (categorias.length == 0) {
        return;
    }
    // sort categorias
    categorias = categorias.sort((a, b) => {
        a.categoria.toLowerCase();
        b.categoria.toLowerCase();
        if (a.categoria > b.categoria) {
            return 1;
        } else if (a.categoria < b.categoria) {
            return -1;
        } else {
            return 0;
        }
    });
    let contenedor = document.querySelector("#factBotonesCategoria");
    categorias.forEach((categoria) => {
        // check empty categorias
        let productosxCategoria = productos.find((prod) => prod.categoria == categoria.categoria);
        if (!productosxCategoria) {
            return;
        }
        contenedor.innerHTML += `<div class="factBotonCategoria" data-id="${categoria.id}" data-categoria="${categoria.categoria}">${categoria.categoria}</div>`;
    });

    document.querySelectorAll(".factBotonCategoria").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            mostrarBotoneraCategoria(e.target.dataset);
        });
    });
}

crearBotonesCategoria();

function mostrarBotoneraCategoria(dataset) {
    let productosxCategoria = productos.filter((prod) => prod.categoria == dataset.categoria);
    if (!productosxCategoria) {
        return;
    }
    let contenedor = document.querySelector("#factContCategorias");
    contenedor.style.display = "flex";
    contenedor.innerHTML += `<div id="menuCerrar">X</div>`;

    productosxCategoria.forEach((producto) => {
        let cantidad = 1;
        if (producto.fraccionamiento == "kilo") {
            cantidad = 250;
        } else if (producto.fraccionamiento == "docena") {
            cantidad = 12;
        }
        contenedor.innerHTML += `<div class="factBotonRapido factBotonRapidoCategorias" data-id="${producto.id}" data-codigo="${producto.codigo}" data-cantidad="${cantidad}">
                <img src="/${producto.img}">
                <span class="factBotonTxt"><h1>${producto.nombre}</h1><h2>${producto.fraccionamiento}</h2></span>
                </div>`;
    });

    document.querySelector("#menuCerrar").addEventListener("click", () => {
        cerrarCategorias(contenedor);
    });

    document.querySelectorAll(".factBotonRapidoCategorias").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            cargarBotonRapido(e);
            cerrarCategorias(contenedor);
        });
    });
}

function cerrarCategorias(contenedor) {
    contenedor.innerHTML = "";
    contenedor.style.display = "none";
}
