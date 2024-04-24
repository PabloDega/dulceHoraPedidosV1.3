let seleccionados = JSON.parse(window.seleccionados)
let productosDeCategoria = [];

if(seleccionados.length > 0){
    seleccionados.forEach((prod) => {
        if(document.querySelector(`#prod${prod}`) !== null){
            document.querySelector(`#prod${prod}`).checked = true;
            productosDeCategoria.push(parseInt(prod));
        }
    })
}

document.querySelectorAll(".productoFabricaCodigo").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
        if(e.target.checked == true){
            productosDeCategoria.push(parseInt(e.target.dataset.id));
            document.querySelector("#inputProductos").value = JSON.stringify(productosDeCategoria);
        } else {
            quitarCodigo(e.target.dataset.id);
        }
    })
})

function quitarCodigo(codigo){
    let i = productosDeCategoria.findIndex(codArray => codArray == codigo);
    productosDeCategoria.splice(i, 1);
    document.querySelector("#inputProductos").value = JSON.stringify(productosDeCategoria);
}