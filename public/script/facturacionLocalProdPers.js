document.querySelector("#agregarProdPers").addEventListener("click", () => {
    window.location.href = "/panel/facturacion/local/productos/personalizados/nuevo";
})

if(document.querySelector("#proPersEditar") !== null){
    document.querySelector("#proPersEditar").addEventListener("click", (e) => {
        window.location.href = `/panel/facturacion/local/productos/personalizados/editar?id=${e.target.dataset.id}`;
    })
}

if(document.querySelector("#proPersEliminar") !== null){
    document.querySelector("#proPersEliminar").addEventListener("click", (e) => {
        window.location.href = `/panel/facturacion/local/productos/personalizados/eliminar?id=${e.target.dataset.id}`;
    })
}