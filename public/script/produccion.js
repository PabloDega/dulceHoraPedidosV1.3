let pedidoProduccion = [];
let totalPedido = 0;

function pedidoProduccionCalcImportes(e){
    let costo = document.querySelector("#costo" + e.target.dataset.id);
    costo = parseInt(costo.innerHTML)
    document.querySelector(`#importe${e.target.dataset.id}`).innerHTML = costo * parseInt(e.target.value);
    pedidoProduccionCalcTotal()
}

function pedidoProduccionCalcTotal(){
    let montos = document.querySelectorAll(".importe");
    let montosArray = [];
    montos.forEach((monto) => montosArray.push(parseInt(monto.innerHTML)));
    totalPedido = montosArray.reduce((acumulador, valor) => {
        return acumulador + valor;
    }, 0);
    document.querySelector("#pedidoProduccionTotal").innerHTML = "Total: $" + totalPedido;
}

document.querySelectorAll(".pedidoProduccionCantidad").forEach((boton) => {
    boton.addEventListener("change", (e) => pedidoProduccionCalcImportes(e))
})

pedidoProduccionCalcTotal()