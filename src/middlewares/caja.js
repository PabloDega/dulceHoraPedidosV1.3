const crearObjApertura = async (datos, usuario) => {
    let fecha = new Date();
    fecha.setHours(fecha.getHours() - 3);

    // ajuste para BBD testing TestAdjust
    // fecha.setHours(fecha.getHours() +5);
    
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
  // fecha.setHours(fecha.getHours() +5);

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
    if(error == 4){
      let error = {msg: "Debe cerrar la caja solicitada para emitir un reporte"}
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

const estadoDeCaja = async (caja) => {
  if(caja.length == 0){
    return {error: true, errorCode: "caja1"};
  }
  let ultimaCaja = caja[0];
  if(ultimaCaja.cierre === null){
    return {error: false};
  } else {
    return {error: true, errorCode: "caja1"};
  }
}

const crearReporteCaja = async (facturas, resumenGeneral, resumenGastos) => {
  let detalleVentasCaja = [];
  // [item, id, cantidad, total]
  facturas.forEach((fact) => {
    let detalles = JSON.parse(fact.detalle);
    detalles.forEach((detalle) => {
      // buscar pro en array
      let ubicacion = detalleVentasCaja.findIndex((dato) => dato[0] == detalle[3]);
      if(ubicacion < 0){
        // insertar prod en array
        let prod = [detalle[3], detalle[5], detalle[4], detalle[1]]
        detalleVentasCaja.push(prod);
      } else {
        // sumar prod al del array
        detalleVentasCaja[ubicacion][2] += detalle[4];
        detalleVentasCaja[ubicacion][3] += detalle[1];
      }
    })
  })
  resumenGeneral.gastos = resumenGastos.gastos;
  resumenGeneral.retiros = resumenGastos.retiros;
  resumenGeneral.detalleVentasCaja = detalleVentasCaja;
  return resumenGeneral;
}

module.exports = {
    crearObjApertura,
    crearObjCierre,
    ceirreCajaErrores,
    calcularCierre,
    calcularApertura,
    estadoDeCaja,
    crearReporteCaja,
}