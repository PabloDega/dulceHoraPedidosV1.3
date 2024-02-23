let productosDeCategoria = [];

document.querySelectorAll(".productoFabricaCodigo").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
        if(e.target.checked == true){
            productosDeCategoria.push(e.target.id);
            document.querySelector("#inputProductos").value = JSON.stringify(productosDeCategoria);
        } else {
            quitarCodigo(e.target.id);
        }
    })
})

function quitarCodigo(codigo){
    let i = productosDeCategoria.findIndex(codArray => codArray == codigo);
    productosDeCategoria.splice(i, 1);
    document.querySelector("#inputProductos").value = JSON.stringify(productosDeCategoria);
}