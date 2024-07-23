if (document.querySelector(".cardCalendarioLocal") != null) {
    document.querySelectorAll(".cardCalendarioLocal").forEach((boton) => boton.addEventListener("click", (e) => {
        document.querySelector("#cortinaLoad").style.display = "flex";
        location.href = `/panel/produccion/local?id=${e.currentTarget.dataset.id}`;
    }));
}

if (document.querySelector(".cardCalendarioFabrica") != null) {
    document.querySelectorAll(".cardCalendarioFabrica").forEach((boton) => boton.addEventListener("click", (e) => {
        document.querySelector("#cortinaLoad").style.display = "flex";
        location.href = `/panel/produccion/fabrica?id=${e.currentTarget.dataset.id}`;
    }));
}