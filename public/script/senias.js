document.querySelectorAll("#modificarSenia").forEach(boton => {
    boton.addEventListener("click", (e) => {
        if(e.target.dataset.accion === "registrar"){
            window.location.href = `/panel/facturacion?id=${e.target.dataset.id}&accion=${e.target.dataset.accion}`;
        } else if(e.target.dataset.accion === "cancelar"){
            window.location.href = `/panel/facturacion/registros/senias/actualizar?id=${e.target.dataset.id}&accion=${e.target.dataset.accion}`;
    }
    })
});

if(document.querySelector("#verMasSenias") !== null){
    document.querySelector("#verMasSenias").addEventListener("click", () => {
        let params = new URLSearchParams(document.location.search);
        let resultados = params.get("resultados")
        if(resultados === null){
            resultados = 15
        }
        resultados = parseInt(resultados) + 15;
        window.location.href = `/panel/facturacion/registros/senias?resultados=${resultados}`
    })
}