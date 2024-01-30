document.querySelectorAll(".precioUpdate").forEach((input) => {
    input.addEventListener("change", (e) => {activarItem(e)})
})

function activarItem(e){
    document.querySelector(`#id${e.target.dataset.id}`).setAttribute("name", "id")
}