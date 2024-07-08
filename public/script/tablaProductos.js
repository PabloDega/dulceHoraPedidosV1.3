document.querySelector("#listaDePrecios").addEventListener("change", (e) => {
    document.querySelector("#cortinaLoad").style.display = "flex";
    let numero = e.target.value.replace(/[^0-9]/g, "");
    window.location.href = `/panel/productos/tabla?lista=${numero}`;
});

document.querySelectorAll("#backListaProdEditar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        location.href = `/panel/productos/editar?id=${e.target.dataset.id}&lista=${window.lista.replace(/[^0-9]/g, "")}`; 
    })
});
