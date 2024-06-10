function monetarizar(valor){
    valor = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
    return valor;
  }

document.querySelector("#efectivo").addEventListener("keyup", () => {
    calcularDiferencia();
})
document.querySelector("#efectivo").addEventListener("change", () => {
    calcularDiferencia();
})
document.querySelector("#reservado").addEventListener("keyup", () => {
    calcularDiferencia();
})
document.querySelector("#reservado").addEventListener("change", () => {
    calcularDiferencia();
})

function calcularDiferencia(){
    let efectivoInput = parseFloat(document.querySelector("#efectivo").value);
    let reservadoInput = parseFloat(document.querySelector("#reservado").value);
    if(isNaN(efectivoInput)){
        efectivoInput = 0;
    }
    if(isNaN(reservadoInput)){
        reservadoInput = 0;
    }
    let calculo = efectivoInput + reservadoInput - calcularCierre.efectivo;
    let efectivoTotal = efectivoInput + reservadoInput;
    cargarCalculo(calculo, efectivoTotal);
}

calcularDiferencia();

function cargarCalculo(calculo, efectivoTotal){
    document.querySelector("#diferencia").innerHTML = monetarizar(calculo);
    document.querySelector("#ingresado").innerHTML = monetarizar(efectivoTotal);
    document.querySelector("#calculado").innerHTML = monetarizar(calcularCierre.efectivo);
    document.querySelector("#ajuste").value = calculo;
}

document.querySelector("#cierreCajaCerrar").addEventListener("submit", (e) => {
    e.preventDefault();
    let check = checkFormulario();
    if(check){
        e.target.submit()
    } else {
        mostrarError("Complete todos los datos del formulario")
    }
});

function checkFormulario(){
    let check = true;
    let efectivo = document.querySelector("#efectivo").value;
    let reservado = document.querySelector("#reservado").value;
    let nombre = document.querySelector("#nombre").value;
    if(isNaN(parseFloat(efectivo)) || isNaN(parseFloat(reservado))){
        check = false;
    }
    if(nombre === ""){
        check = false;
    }
    return check;
}

function mostrarError(info){
    let mensaje = `<div class="mensajeErrorForm"><span>${info}</span><span id="timeBar"></span></div>`;
    document.querySelector("#errores").innerHTML = mensaje;
    document.querySelector(".mensajeErrorForm").addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}
document.querySelector("#reporte").value = JSON.stringify(window.reporte);