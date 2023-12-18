let totalPedido = 0;

function pedidoProduccionCalcImporte(e){
    if(isNaN(parseInt(e.target.value))){
        e.target.value = 0;
        return;
    }
    let costo = document.querySelector("#costo" + e.target.dataset.id);
    costo = parseInt(costo.innerHTML)
    document.querySelector(`#importe${e.target.dataset.id}`).innerHTML = costo * parseInt(e.target.value);
    pedidoProduccionCalcTotal();
}

function pedidoProduccionCalcImportes(){
    document.querySelectorAll(".importe").forEach((importe) => {
        let item = importe.id.slice(7);
        let importeFinal = document.querySelector("#costo" + item).innerHTML * document.querySelector("#cantidad" + item).value;
        importe.innerHTML = importeFinal;
    })
}

function pedidoProduccionCalcTotal(){
    let montosArray = [];
    document.querySelectorAll(".importe").forEach((monto) => montosArray.push(parseInt(monto.innerHTML)));
    totalPedido = montosArray.reduce((acumulador, valor) => {
        return acumulador + valor;
    }, 0);
    document.querySelector("#pedidoProduccionTotal").innerHTML = "Total: $" + totalPedido;
    pedidoProduccionImporteTotal.value = totalPedido
}

document.querySelectorAll(".pedidoProduccionCantidad").forEach((boton) => {
    boton.addEventListener("change", (e) => {
        pedidoProduccionCalcImporte(e);
        if(window.minimos){
            calcularCantidades(e);
        }
    })
})

if(window.minimos){
    for(categoria in window.minimosCategoria){
        if(window.minimosCategoria[categoria][1] > 0){
            const catJoin = categoria.split(" ").join("");
            let itemsCategoria = document.querySelectorAll(`.${catJoin}`);   
            let suma = 0;
            itemsCategoria.forEach((item) => suma = suma + parseInt(item.value));
            window.minimosCategoria[categoria][0] = suma;
            console.log(`#cantidad${catJoin}`)
            document.querySelector(`#cantidad${catJoin}`).innerHTML = suma;
        }
    }
}

function calcularCantidades(e){
    if(window.minimosCategoria[e.target.dataset.categoria][1] > 0){
        let itemsCategoria = document.querySelectorAll(`.${e.target.dataset.categoria}`);   
        let suma = 0;
        itemsCategoria.forEach((item) => suma = suma + parseInt(item.value));
        window.minimosCategoria[e.target.dataset.categoria][0] = suma;
        document.querySelector(`#cantidad${e.target.dataset.categoria}`).innerHTML = suma;
    }
}

function evaluarCantidades(){
    window.minimosCategoria.forEach((item) => {

    })
}

pedidoProduccionCalcImportes();
pedidoProduccionCalcTotal();