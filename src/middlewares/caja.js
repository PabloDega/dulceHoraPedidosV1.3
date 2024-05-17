const crearObjApertura = async (datos, usuario) => {
    let fecha = new Date();
    fecha.setHours(fecha.getHours() - 3);

    // ajuste para BBD testing TestAdjust
    fecha.setHours(fecha.getHours() +5);
    
    let apertura = {
        fecha,
        efectivo: parseFloat(datos.efectivo),
        reservado: parseFloat(datos.reservado),
        ajuste: parseFloat(datos.ajuste),
        nombre: datos.nombre,
        usuario,
    };
    return apertura;
}

const crearObjCierre = async (datos, usuario) => {
  let fecha = new Date();
  fecha.setHours(fecha.getHours() - 3);

  // ajuste para BBD testing TestAdjust
  fecha.setHours(fecha.getHours() +5);

  let apertura = {
      fecha,
      efectivo: parseFloat(datos.efectivo),
      reservado: parseFloat(datos.reservado),
      ajuste: parseFloat(datos.ajuste),
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
    efectivo: apertura.efectivo + apertura.reservado + resumen.totalEfectivo - resumenGastos.gastos - resumenGastos.retiros,
  }
  return calculoCierre;
}

const calcularApertura = async (resumen, resumenGastos, registro) => {
  const cierre = JSON.parse(registro.cierre);

  let calculoApertura = {
    efectivo: cierre.efectivo + cierre.reservado + resumen.totalEfectivo - resumenGastos.gastos - resumenGastos.retiros,
  }
  return calculoApertura;
}

module.exports = {
    crearObjApertura,
    crearObjCierre,
    ceirreCajaErrores,
    calcularCierre,
    calcularApertura,    
}