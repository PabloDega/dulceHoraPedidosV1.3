document.querySelectorAll(".btnAbrirPedido").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelector("#cortinaLoad").style.display = "flex";
        window.location.href = `/panel/produccion/fabrica?id=${e.currentTarget.dataset.id}`;
    })
})