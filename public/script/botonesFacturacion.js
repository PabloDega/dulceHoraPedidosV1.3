document.querySelectorAll(".FactBotonEditar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        let id = e.target.dataset.id;
        if(!id){return}
        location.href = `/panel/facturacion/fabrica/botones/editar?id=${id}`;
    })
})

document.querySelectorAll(".FactBotonEliminar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        let id = e.target.dataset.id;
        if(!id){return}
        confirmaEliminar(e.target.dataset)
        // location.href = `/panel/facturacion/fabrica/botones/eliminar?id=${id}`;
    })
})