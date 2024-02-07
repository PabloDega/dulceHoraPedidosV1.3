document.querySelector("#codigo").addEventListener("change", (e) => {cargarNombre()})

function cargarNombre(){
    let codigo = document.querySelector("#codigo");
    let producto = window.productos.find((prod) => prod.codigo == codigo.value);
    if(producto === undefined){
        mostrarError(`Codigo de producto ${codigo.value} inexistente`)
        document.querySelector("#nombre").value = "";
        codigo.value = "";
        return
    } else {
        document.querySelector("#nombre").value = producto.nombre
    }
}

function mostrarError(info){
    let mensaje = `<div class="mensajeErrorForm"><span>${info}</span></div>`;
    document.querySelector("#errores").innerHTML = mensaje;
    document.querySelector(".mensajeErrorForm").addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}

if(document.querySelector("#codigo").value !== ""){
    cargarNombre();
}
