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

const calcularFacturacionxFechaxLocal = async (locales, fecha) => {
    const facturas = await servicesFacturacion.getFacturasNFTodas();
    let factucionxLocal = [];
    locales.forEach((local) => {
        let datos = {};
        datos.local = local.nombre;
        datos.localId = local.id;
        let facturasLocal = facturas.filter((factura) => factura.local == local.id);
        facturasLocal = facturasLocal.filter((factura) => factura.fecha == fecha);
        let total = 0;
        let operaciones = 0;
        facturasLocal.forEach((factura) => {
            if(factura.tipo == "X"){
                total += factura.total;
                operaciones++;
            } else if(factura.tipo == "NC"){
                total -= factura.total;
            }
        });
        datos.total = total;
        datos.operaciones = operaciones;
        factucionxLocal.push(datos);
    });
    return factucionxLocal;
}

const crearResumenVistaLocal = async (local, fecha) => {
    let facturasNF = await servicesFacturacion.getFacturasNFxfecha(local, fecha);

    let totalDia = 0;
    let totalNF = 0;
    let totalEfectivo = 0;
    let totalDebito = 0;
    let totalCredito = 0;
    let totalNB = 0;
    let totalFiscal = 0;
    let contadorOperaciones = 0;

    facturasNF.forEach((factura) => {
        if(factura.tipo === "X"){
            totalDia += factura.total;
            totalNF += factura.total;
            contadorOperaciones++;
        };
        switch (factura.formaPago) {
            case "efectivo":
                totalEfectivo += factura.total;
                break;
            case "debito":
                totalDebito += factura.total;
                break;
            case "credito":
                totalCredito += factura.total;
                break;
            case "transferencia":
                totalNB += factura.total;
                break;
            default:
                break;
        }
    });

    let promedio = totalDia / contadorOperaciones

    let resumen = {
        totalDia: monetarizar(totalDia),
        totalNF: monetarizar(totalNF),
        totalEfectivo: monetarizar(totalEfectivo),
        totalDebito: monetarizar(totalDebito),
        totalCredito: monetarizar(totalCredito),
        totalNB: monetarizar(totalNB),
        contadorOperaciones,
        promedio: monetarizar(promedio),
    }
    return resumen;
}

function monetarizar(valor){
    valor = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS'  }).format(valor);
    return valor;
}

const checkDummy = async () => {
    
}

module.exports = {
    imprimirTicket,
    fechaHoy,
    fechaHyphen,
    fechaNormalizada,
    calcularFacturacionxFechaxLocal,
    crearResumenVistaLocal,
    checkDummy,
}