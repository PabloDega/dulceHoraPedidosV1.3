let totalPedido = 0;

function pedidoProduccionCalcImporte(e){
    if(isNaN(parseFloat(e.target.value))){
        e.target.value = 0;
        return;
    }
    let costo = document.querySelector("#costo" + e.target.dataset.id);
    costo = parseFloat(costo.innerHTML);
    if(costo === 0){
        mostrarError("El producto seleccionado no tiene en monto cargado, por favor comunicarse con administración para modificarlo");
        e.target.value = 0;
        return;
    }
    document.querySelector(`#importe${e.target.dataset.id}`).innerHTML = costo * parseFloat(e.target.value);
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
    document.querySelectorAll(".importe").forEach((monto) => montosArray.push(parseFloat(monto.innerHTML)));
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

//Evitar que el fomulario se envie con enter
document.querySelector("#nuevaProduccion").addEventListener("keypress", (e) => {
    if(e.keyCode == 13){
        e.preventDefault();
    }
})

//Validar cantidades previo envio
document.querySelector("#pedidoProduccionUpdate").addEventListener("click", (e) => {
    e.preventDefault();
    if(window.minimos){
        if(validarCantidades()){
            document.querySelector("#cortinaLoad").style.display = "flex";
            document.querySelector("#nuevaProduccion").submit();
        }
    } else {
        document.querySelector("#cortinaLoad").style.display = "flex";
        document.querySelector("#nuevaProduccion").submit();
    }
});

// vaciar inpuit en 0 al darle click
document.querySelectorAll("input.pedidoProduccionCantidad").forEach((boton) => {
    boton.addEventListener("focus", (e) => {
        if (e.target.value == 0) {
            e.target.value = "";
        }
    });
    boton.addEventListener("focusout", (e) => {
      if (e.target.value == "") {
          e.target.value = 0;
      }
  });
});

function mostrarError(info){
    let mensaje = `<div class="mensajeErrorForm"><span>${info}</span><span id="timeBar"></span></div>`;
    document.querySelector("#errores").innerHTML = mensaje;
    document.querySelector(".mensajeErrorForm").addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}

pedidoProduccionCalcImportes();
pedidoProduccionCalcTotal();