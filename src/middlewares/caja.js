const crearObjApertura = async (datos, usuario) => {
    let fecha = new Date();
    let apertura = {
        fecha,
        efectivo: parseFloat(datos.efectivo),
        reservado: parseFloat(datos.reservado),
        nombre: datos.nombre,
        usuario,
    };
    return apertura;
}

const crearObjCierre = async (datos, usuario) => {
  let reservadoDiferencia = datos.reservadoDiferencia.substring(1);
  let efectivoDiferencia = datos.efectivoDiferencia.substring(1);
  let fecha = new Date();
  let ajuste = parseFloat(reservadoDiferencia) + parseFloat(efectivoDiferencia);
  let apertura = {
      fecha,
      efectivo: parseFloat(datos.efectivo),
      reservado: parseFloat(datos.reservado),
      ajuste,
      nombre: datos.nombre,
      usuario,
  };
  return apertura;
}

const ceirreCajaErrores = async (error) => {
    let errores = [];
    if(error == 1){
      let error = {msg: "Debe cerrar la última caja para poder abrir una nueva"}
      errores.push(error);
    }
    if(error == 2){
      let error = {msg: "El numero de cierre solicitado es incorrecto"}
      errores.push(error);
    }
    if(error == 3){
      let error = {msg: "La caja solicitada ya se encuentra cerrada"}
      errores.push(error);
    }
    return errores;
}

const calcularCierre = async (resumen, resumenGastos, registro) => {
  const apertura = JSON.parse(registro.inicio);

  let calculoCierre = {
    efectivo: apertura.efectivo + resumen.totalEfectivo - resumenGastos.gastos - resumenGastos.alivios,
    reservado: apertura.reservado + resumenGastos.alivios - resumenGastos.retiros,
  }
  return calculoCierre;
}

module.exports = {
    crearObjApertura,
    crearObjCierre,
    ceirreCajaErrores,
    calcularCierre,    
}