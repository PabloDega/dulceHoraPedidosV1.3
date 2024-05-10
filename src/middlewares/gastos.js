const crearResumenGastos = async (datos) => {
    let gastos = {
        gastos: 0,
        alivios: 0,
        retiros: 0,
        totalMovimientos: 0,
    }

    datos.forEach((dato) => {
        if(dato.movimiento == "gasto"){
            gastos.gastos += dato.monto;
            gastos.totalMovimientos ++;
        } else if(dato.movimiento == "alivio"){
            gastos.alivios += dato.monto;
            gastos.totalMovimientos ++;
        } else if(dato.movimiento == "retiro"){
            gastos.retiros += dato.monto;
            gastos.totalMovimientos ++;
        }
    });

    return gastos;
}

const crearObjetoGastos = async (body, usuario, local) => {
    let gastos = {}
    gastos.usuario = usuario;
    gastos.local = local;
    gastos.fecha = body.fecha;
    gastos.movimiento = body.movimiento;
    gastos.monto = body.monto;
    gastos.detalles = body.detalles;
    return gastos;

    
}

module.exports = {
    crearResumenGastos,
    crearObjetoGastos,
}