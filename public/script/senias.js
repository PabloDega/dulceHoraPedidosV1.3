document.querySelectorAll("#modificarSenia").forEach(boton => {
    boton.addEventListener("click", (e) => {
        window.location.href = `/panel/facturacion/registros/senias/actualizar?id=${e.target.dataset.id}&accion=${e.target.dataset.accion}`;
    })
})