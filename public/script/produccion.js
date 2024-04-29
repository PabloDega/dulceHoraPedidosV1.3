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
    document.querySelector("#pedidoProduccionImporteTotal").value = totalPedido;
}

document.querySelectorAll(".pedidoProduccionCantidad").forEach((boton) => {
    boton.addEventListener("change", (e) => {
        pedidoProduccionCalcImporte(e);
        precargaLocalStorage();
        calcularCantidades(e);
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
    if(fechaEntrega !== null){
        let diaEntrega = new Date(fechaEntrega.split("/")[2], fechaEntrega.split("/")[1]-1, fechaEntrega.split("/")[0]).getDay()
        document.querySelector("#pedidoProduccionFechaEntrega").value = localStorage.getItem("fechaEntregaActiva");
        document.querySelector("#pedidoProduccionDatosFechaEntrega").innerHTML = diasDeLaSemana[diaEntrega] + " " + fechaEntrega;
    }
}
if(document.querySelector("#pedidoProduccionVerPedidoAnterior") != null){
    document.querySelector("#pedidoProduccionVerPedidoAnterior").addEventListener("click", () => {
        document.querySelectorAll(".pedidoProduccionUltimoPedido").forEach((elem) => {
            elem.classList.toggle("visible");
        })
    });
}

function vaciarImportes() {
    document.querySelectorAll(".pedidoProduccionCantidad").forEach((input) => {
        input.value = 0;
    });
    localStorage.setItem("precargaPedidoProduccion", "[]");
    pedidoProduccionCalcImportes();
    pedidoProduccionCalcTotal();
}

if(document.querySelector("#pedidoProduccionVaciar") !=null){
    document.querySelector("#pedidoProduccionVaciar").addEventListener("click", () => {
        vaciarImportes();
    })
}

if(document.querySelector("#pedidoProduccionEnviar") != null){
    document.querySelector("#pedidoProduccionEnviar").addEventListener("click", (e) => {
        e.preventDefault();
        pedidoProduccionCalcTotal();
        localStorage.removeItem("precargaPedidoProduccion");
        if(validarCantidades()){
            document.querySelector("#cortinaLoad").style.display = "flex";
            document.querySelector("#nuevaProduccion").submit();
        }
    })
}

//Evitar que el fomulario se envie con enter
document.querySelector("#nuevaProduccion").addEventListener("keypress", (e) => {
    if(e.keyCode == 13){
        e.preventDefault();
    }
})

function calcularCantidades(e){
    if(window.minimosCategoria[e.target.dataset.categoria][1] > 0){
        let itemsCategoria = document.querySelectorAll(`.${e.target.dataset.categoria}`);
        let suma = 0;
        itemsCategoria.forEach((item) => suma = suma + parseInt(item.value));
        window.minimosCategoria[e.target.dataset.categoria][0] = suma;
        document.querySelector(`#cantidad${e.target.dataset.categoria}`).innerHTML = suma;
    }
}

for(categoria in window.minimosCategoria){
    if(window.minimosCategoria[categoria][1] > 0){
        let itemsCategoria = document.querySelectorAll(`.${categoria}`);
        if(itemsCategoria.length > 0){
            let suma = 0;
            itemsCategoria.forEach((item) => {
                suma = suma + parseInt(item.value);
            });
            window.minimosCategoria[categoria][0] = suma;
            document.querySelector(`#cantidad${categoria}`).innerHTML = suma;
        }
    }
}

function validarCantidades(){
    let x = 0;
    for(item in window.minimosCategoria){
        if(window.minimosCategoria[item][0] < window.minimosCategoria[item][1] && window.minimosCategoria[item][0] !== 0){
            x++;
        }
    }
    if(x > 0){
        let popScreen = document.querySelector("#popScreen");
        popScreen.innerHTML += `<div id="cortina">
        <div id="confirmarEliminar">
            Para poder continuar debe verificar si las cantidades seleccionadas cumplen con las cantidades mínimas de cada categoría.
            <div class="btn btnRojo" id="btnEliminarCancelar">Continuar</div>
        </div>
        </div>`;
        document.querySelector("#btnEliminarCancelar").addEventListener("click", cerrarPopEliminar);
        return false;
    }
    return true;
}


pedidoProduccionCalcImportes();
pedidoProduccionCalcTotal();
setFechaDeEntrega();