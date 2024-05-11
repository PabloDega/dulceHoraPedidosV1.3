document.querySelector("#cierreCajaAperturaCargar").addEventListener("click", () => {
    document.querySelector("#efectivo").value = window.cierrePrevio.efectivo;
    document.querySelector("#reservado").value = window.cierrePrevio.reservado;
})