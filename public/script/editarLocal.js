document.querySelector("#listaDePrecios").addEventListener("change", (e) => {
    let checkbox = document.querySelector(`.listasDisp#lista${e.target.value}`);
    if(!checkbox.checked){
        checkbox.checked = true;
    }
})

let checks = document.querySelectorAll(".listasDisp");
checks.forEach((checkbox) => checkbox.addEventListener("click", (e) => {
    // verirficar que no se des-seleccione la lista primaria
    let listaPrimaria = document.querySelector("#listaDePrecios").value;
    if(e.target.value === listaPrimaria && !e.target.checked){
        e.preventDefault();
        mostrarError("No puede desmarcar la lista de precio primaria de la lista")
    }
}))

function mostrarError(info){
    let mensaje = `<div class="mensajeErrorForm"><span>${info}</span><span id="timeBar"></span></div>`;
    document.querySelector("#errores").innerHTML = mensaje;
    document.querySelector(".mensajeErrorForm").addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}