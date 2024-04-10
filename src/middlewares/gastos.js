const crearResumenGastos = async (datos) => {
    let gastos = {
        gastos: 0,
        retiros: 0,
        totalMovimientos: 0,
    }

    datos.forEach((dato) => {
        if(dato.movimiento == "gasto"){
            gastos.gastos += dato.monto;
            gastos.totalMovimientos ++;
        } else if(dato.movimiento == "retiro"){
            gastos.retiros += dato.monto;
            gastos.totalMovimientos ++;
        }
    });

    return gastos;
}

module.exports = {
    crearResumenGastos
}