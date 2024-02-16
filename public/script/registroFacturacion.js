document.querySelector("#fechaRegFact").addEventListener("change", (e) => {
    let fecha = e.target.value;
    fecha = fecha.replace(/-/g, "")
    window.location.href = `/panel/facturacion/registros?fecha=${fecha}`;
})