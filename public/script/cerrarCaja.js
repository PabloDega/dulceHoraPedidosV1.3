document.querySelector("#efectivo").addEventListener("keyup", (e) => {
    calcularDiferenciaEfectivo(e);
});

document.querySelector("#efectivo").addEventListener("change", (e) => {
    calcularDiferenciaEfectivo(e);
});

function calcularDiferenciaEfectivo(e){
    const diferencia = calcularCierre.efectivo - e.target.value;
    document.querySelector("#efectivoDiferencia").value = "$" + diferencia;
}

document.querySelector("#reservado").addEventListener("keyup", (e) => {
    calcularDiferenciaReservado(e);
});

document.querySelector("#reservado").addEventListener("change", (e) => {
    calcularDiferenciaReservado(e);
});

function calcularDiferenciaReservado(e){
    const diferencia = calcularCierre.reservado - e.target.value;
    document.querySelector("#reservadoDiferencia").value = "$" + diferencia;
}