document.querySelector("#listaDePrecios").addEventListener("change", (e) => {
    document.querySelector("#cortinaLoad").style.display = "flex";
    let numero = e.target.value.replace(/[^0-9]/g, "");
    window.location.href = `/panel/productosFabrica/precios?lista=${numero}`;
});