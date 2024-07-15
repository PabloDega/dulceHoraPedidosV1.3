document.querySelector("#listaDePrecios").addEventListener("change", (e) => {
    document.querySelector("#cortinaLoad").style.display = "flex";
    let numero = e.target.value.replace(/[^0-9]/g, "");
    window.location.href = `/panel/productosFabrica?lista=${numero}`;
});

document.querySelectorAll(".backListaProdFabricaEditar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        location.href = `/panel/productosFabrica/editar?id=${e.target.dataset.id}&lista=${window.lista.replace(/[^0-9]/g, "")}`; 
    })
});