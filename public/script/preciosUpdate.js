document.querySelectorAll(".precioUpdate").forEach((input) => {
    input.addEventListener("change", (e) => {activarItem(e)})
})

function activarItem(e){
    document.querySelector(`#id${e.target.dataset.id}`).setAttribute("name", "id")
}

document.querySelector("#listaDePrecios").addEventListener("change", (e) => {
    let numero = e.target.value.replace(/[^0-9]/g, "");
    window.location.href = `/panel/precios?lista=${numero}`;
})

document.querySelector("#preciosEnviar").addEventListener("click", () => {
    document.querySelector("#cortinaLoad").style.display = "flex";
})