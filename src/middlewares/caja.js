const crearObjApertura = async (datos, usuario) => {
    let fecha = new Date();
    let apertura = {
        fecha,
        efectivo: parseInt(datos.efectivo),
        reservado: parseInt(datos.reservado),
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

module.exports = {
    crearObjApertura,
    ceirreCajaErrores,
}