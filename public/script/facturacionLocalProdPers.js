document.querySelector("#agregarProdPers").addEventListener("click", () => {
    window.location.href = "/panel/facturacion/local/productos/personalizados/nuevo";
})

if(document.querySelector("#proPersEditar") !== null){
    document.querySelectorAll("#proPersEditar").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            window.location.href = `/panel/facturacion/local/productos/personalizados/editar?id=${e.target.dataset.id}`;
        })
    });
}

if(document.querySelector("#proPersEliminar") !== null){
    document.querySelectorAll("#proPersEliminar").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            confirmaEliminar(e.target.dataset);
        });
    });
}