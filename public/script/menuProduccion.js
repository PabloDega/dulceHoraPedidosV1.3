document.querySelectorAll(".filtroProduccion").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        toggleFiltro(e.currentTarget.dataset.filtro)
    })
})

let querys = new URLSearchParams(window.location.search);
querys = querys.getAll("filtro");

querys.forEach((filtro) => {
    document.querySelector(`#${filtro}`).classList.add("filtroProduccionActivo")
});

function toggleFiltro(filtro){
    let url = "/panel/produccion/fabrica/tabla";
    if(filtro === "todos"){
        window.location.href = url;
        return;
    }
    let buscarFiltroEnQuery = querys.findIndex((query) => query == filtro);
    if(buscarFiltroEnQuery == -1){
        querys.push(filtro);
    } else {
        querys.splice(buscarFiltroEnQuery, 1);
    }
    if(querys.length == 0){
        window.location.href = url;
        return;
    }
    let parsedFiltros = [];
    querys.forEach((query) => {
        parsedFiltros.push("filtro="+query)
    })
    let query = parsedFiltros.join("&");
    url = url + "?" + query;
    window.location.href = url;
}