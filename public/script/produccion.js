let pedidoProduccion = [];
let totalPedido = 0;
let diasDeLaSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"];

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
        precargaLocalStorage();
    })
})

function precargaLocalStorage(){
    precargaPedidoProduccion = [];
    document.querySelectorAll(".pedidoProduccionCantidad").forEach((cantidad) => {
        if(cantidad.value > 0){
            let pedidoItem = [];
            pedidoItem.push(cantidad.dataset.id)
            pedidoItem.push(cantidad.value)
            precargaPedidoProduccion.push(pedidoItem)
        }
    })
    localStorage.setItem("precargaPedidoProduccion", JSON.stringify(precargaPedidoProduccion));
}

let precargaAnterior = JSON.parse(localStorage.getItem("precargaPedidoProduccion"))

if(precargaAnterior && precargaAnterior.length > 0){
    precargaAnterior.forEach((item) => {
        document.querySelector("#cantidad" + item[0]).value = item[1];
    })
}

function setFechaDeEntrega(){
    let fechaEntrega = localStorage.getItem("fechaEntregaActiva");
    let diaEntrega = new Date(fechaEntrega.split("/")[2], fechaEntrega.split("/")[1]-1, fechaEntrega.split("/")[0]).getDay()
    document.querySelector("#pedidoProduccionFechaEntrega").value = localStorage.getItem("fechaEntregaActiva");
    document.querySelector("#pedidoProduccionDatosFechaEntrega").innerHTML = diasDeLaSemana[diaEntrega] + " " + fechaEntrega;
}

document.querySelector("#pedidoProduccionVerPedidoAnterior").addEventListener("click", () => {
    document.querySelectorAll(".pedidoProduccionUltimoPedido").forEach((elem) => {
        elem.classList.toggle("visible");
    })
})
function vaciarImportes() {
    document.querySelectorAll(".pedidoProduccionCantidad").forEach((input) => {
        input.value = 0;
    });
    localStorage.setItem("precargaPedidoProduccion", "[]");
    pedidoProduccionCalcImportes();
    pedidoProduccionCalcTotal();
}

document.querySelector("#pedidoProduccionVaciar").addEventListener("click", () => {
    vaciarImportes();
})

document.querySelector("#pedidoProduccionEnviar").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("precargaPedidoProduccion");
    document.querySelector("#nuevaProduccion").submit();
})


pedidoProduccionCalcImportes();
pedidoProduccionCalcTotal();
setFechaDeEntrega();