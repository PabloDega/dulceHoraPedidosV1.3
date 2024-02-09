document.querySelector("#regresar").addEventListener("click", () => {
    window.location.href = "/panel/facturacion"
})

document.querySelector("#imprimir").addEventListener("click", () => {
    window.print();
})

window.addEventListener("afterprint", () => {
    window.location.href = "/panel/facturacion"
});