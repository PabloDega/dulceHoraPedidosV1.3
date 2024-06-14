document.querySelectorAll(".btnAbrirPedido").forEach(btn => {
    btn.addEventListener("click", (e) => {
        document.querySelector("#cortinaLoad").style.display = "flex";
        window.location.href = `/panel/produccion/${e.currentTarget.dataset.lector}?id=${e.currentTarget.dataset.id}`;
    })
})