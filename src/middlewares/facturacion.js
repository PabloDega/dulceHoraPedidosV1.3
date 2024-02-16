const servicesFacturacion = require(__basedir + "/src/services/facturacion");

const imprimirTicket = async (idFactura) => {
    console.log(factura)
}

const fechaHoy = async () => {
    let hoy = new Date();
    let anio = hoy.getFullYear();
    let mes = hoy.getMonth() + 1;
    let dia = hoy.getDate();
    if(mes < 10){
        mes = "0" + mes;
    }
    if(dia < 10){
        dia = "0" + dia;
    }
    let fecha = anio.toString() + mes.toString() + dia.toString();
    return fecha;
}

const fechaHyphen = async (fecha) => {
    let anio = fecha.slice(0, 4)
    let mes = fecha.slice(4, 6)
    let dia = fecha.slice(6, 8)
    let fechaHyphen = anio + "-" + mes + "-" + dia;
    return fechaHyphen;
}

const fechaNormalizada = async (fecha) => {
    let anio = fecha.slice(0, 4)
    let mes = fecha.slice(4, 6)
    let dia = fecha.slice(6, 8)
    let fechaNormalizada = dia + "/" + mes + "/" + anio;
    return fechaNormalizada;
}

module.exports = {
    imprimirTicket,
    fechaHoy,
    fechaHyphen,
    fechaNormalizada,
}