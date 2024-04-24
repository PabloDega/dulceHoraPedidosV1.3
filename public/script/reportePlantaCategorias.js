document.querySelectorAll("#reportePlantaCategoriasEditar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        window.location.href = `/panel/produccion/reportes/categorias/editar?id=${e.target.dataset.id}`
    })
})