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

function monetarizar(valor){
    valor = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS'  }).format(valor);
    return valor;
}

module.exports = {
    crearResumenGastos,
    crearObjetoGastos,
}