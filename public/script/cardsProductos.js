document.querySelectorAll("#backListaProdEditar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        location.href = `/panel/productos/editar?id=${e.target.dataset.id}&lista=${window.lista.replace(/[^0-9]/g, "")}`; 
    })
});
