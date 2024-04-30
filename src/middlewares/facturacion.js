const servicesFacturacion = require(__basedir + "/src/services/facturacion");

const axios = require('axios');

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

const crearResumenVistaLocal = async (facturas) => {
    let totales = {
        totalDia: 0,
        totalNF: 0,
        totalCAE: 0,
        totalEfectivo: 0,
        totalDebito: 0,
        totalCredito: 0,
        totalNB: 0,
        totalSeniado: 0,
        contadorOperaciones: 0,
    }

    facturas.forEach((factura) => {
        if(factura.tipo === "X"){
            totales.totalDia += factura.total;
            totales.totalNF += factura.total;
            totales.contadorOperaciones++;
            totales = sumarFormaDePago(factura, totales);
        } else if(factura.tipo === "NC"){
            totales.totalDia -= factura.total;
            totales.totalNF -= factura.total;
            totales.contadorOperaciones++;
            totales = restarFormaDePagoNC(factura, totales)
        } else if(factura.tipo === 1 || factura.tipo === 6 || factura.tipo === 11){
            totales.totalDia += factura.total;
            totales.totalCAE += factura.total;
            totales.contadorOperaciones++;
            totales = sumarFormaDePago(factura, totales);
        } else if(factura.tipo === 3 || factura.tipo === 8 || factura.tipo === 13){
            totales.totalDia -= factura.total;
            totales.totalCAE -= factura.total;
            totales.contadorOperaciones++;
            totales = restarFormaDePagoNC(factura, totales);
        } else if(factura.tipo === "S"){
            let obs = JSON.parse(factura.observaciones);
            if(obs.estadoSenia === "cancelado" || obs.estadoSenia === "retirado"){
                return;
            } else {
                totales.totalDia += factura.senia;
                // totalNF += factura.senia;
                totales.totalSeniado += factura.senia;
                totales = sumarFormaDePagoSenia(factura, totales);
            }
        }
    });

    let promedio = totales.totalDia / totales.contadorOperaciones

    let resumen = {
        totalDia: monetarizar(totales.totalDia),
        totalNF: monetarizar(totales.totalNF),
        totalCAE: monetarizar(totales.totalCAE),
        totalEfectivo: monetarizar(totales.totalEfectivo),
        totalDebito: monetarizar(totales.totalDebito),
        totalCredito: monetarizar(totales.totalCredito),
        totalNB: monetarizar(totales.totalNB),
        totalSeniado: monetarizar(totales.totalSeniado),
        contadorOperaciones: totales.contadorOperaciones,
        promedio: monetarizar(promedio),
    }
    return resumen;
}

function sumarFormaDePago(factura, totales){
    switch (factura.formaPago) {
        case "efectivo":
            totales.totalEfectivo += factura.total;
            // totalEfectivo -= factura.senia;
            break;
        case "debito":
            totales.totalDebito += factura.total;
            // totalDebito -= factura.senia;
            break;
        case "credito":
            totales.totalCredito += factura.total;
            // totalCredito -= factura.senia;
            break;
        case "virtual":
            totales.totalNB += factura.total;
            // totalNB -= factura.senia;
            break;
        case "multiple":
            let pagoMultiple = JSON.parse(factura.observaciones);
            pagoMultiple = pagoMultiple.pagoMultiple;
            totales.totalEfectivo += pagoMultiple.montoefectivo;
            totales.totalDebito += pagoMultiple.montodebito;
            totales.totalCredito += pagoMultiple.montocredito;
            totales.totalNB += pagoMultiple.montovirtual;
            break;
        default:
            break;
    }
    return totales;
}

function sumarFormaDePagoSenia(factura, totales){
    switch (factura.formaPago) {
        case "efectivo":
            totales.totalEfectivo += factura.senia;
            break;
        case "debito":
            totales.totalDebito += factura.senia;
            break;
        case "credito":
            totales.totalCredito += factura.senia;
            break;
        case "virtual":
            totales.totalNB += factura.senia;
            break;
        case "multiple":
            let pagoMultiple = JSON.parse(factura.observaciones);
            pagoMultiple = pagoMultiple.pagoMultiple;
            totales.totalEfectivo += pagoMultiple.montoefectivo;
            totales.totalDebito += pagoMultiple.montodebito;
            totales.totalCredito += pagoMultiple.montocredito;
            totales.totalNB += pagoMultiple.montovirtual;
            break;
        default:
            break;
    }
    return totales;
}

function restarFormaDePagoNC(factura, totales){
    switch (factura.formaPago) {
        case "efectivo":
            totales.totalEfectivo -= factura.total;
            // totalEfectivo -= factura.senia;
            break;
        case "debito":
            totales.totalDebito -= factura.total;
            // totalDebito -= factura.senia;
            break;
        case "credito":
            totales.totalCredito -= factura.total;
            // totalCredito -= factura.senia;
            break;
        case "virtual":
            totales.totalNB -= factura.total;
            // totalNB -= factura.senia;
            break;
        case "multiple":
            let pagoMultiple = JSON.parse(factura.observaciones);
            pagoMultiple = pagoMultiple.pagoMultiple;
            totales.totalEfectivo -= pagoMultiple.montoefectivo;
            totales.totalDebito -= pagoMultiple.montodebito;
            totales.totalCredito -= pagoMultiple.montocredito;
            totales.totalNB -= pagoMultiple.montovirtual;
            break;
        default:
            break;
    }
    return totales;
}

function monetarizar(valor){
    valor = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS'  }).format(valor);
    return valor;
}

const checkDummy = async () => {
    
}

const crearReqAPIWSFE = async (body, local) => {
    let datos = {};
    datos.cuit = local.cuit;
    datos.punto = local.ptoventa;
    datos.tipo = body.tipo;
    datos.importe = body.total;
    datos.neto = body.neto;
    datos.iva10 = body.iva10;
    datos.baseiva10 = body.netoiva10;
    datos.iva21 = body.iva21;
    datos.baseiva21 = body.netoiva21;
    datos.total = body.total;
    datos.cuitR = body.cuit;
    datos.local = local.id;
    datos.pagoMultiple = body.pagoMultiple;
    datos.senia = body.senia;
    datos.formaDePago = body.formaDePago
    return datos
}

const crearReqAPIWSFEparaNC = async (datos, local, fechaCbte) => {
    datos.cuit = local.cuit;
    datos.punto = local.ptoventa;
    datos.importe = datos.total;
    datos.CbteAsoc = {}
    datos.CbteAsoc.Tipo = datos.tipo;
    datos.CbteAsoc.PtoVta = datos.ptoventa;
    datos.CbteAsoc.Nro = datos.numero;
    datos.CbteAsoc.Cuit = datos.cuit;
    datos.CbteAsoc.CbteFch = fechaCbte;
    datos.cuitR = datos.receptor;
    delete datos.CAE
    datos.tipo = datos.tipo + 2;
    datos.fecha = datos.fecha.replace(/-/g, "");
    datos.CbteAsoc.CbteFch = datos.CbteAsoc.CbteFch.replace(/-/g, "");
    datos.CbteAsoc = JSON.stringify(datos.CbteAsoc);
    return datos
}

const fetchAPIWSFE = async (data) => {
  let CAE;
  data = new URLSearchParams(data);
  const URL = `http://localhost:4004/wsfe/solicitarCAE/api`;
    try {
        const respuesta = await axios.post(URL, data);
        CAE = respuesta.data;
        // console.log("--> Respuesta CAE: " + JSON.stringify(respuesta.data));
    } catch (error) {
        console.log("--> Error CAE: " + error)
        CAE = error;
    }
  return CAE;
}; 

const validarReq = async(body) => {
  
}

const ajustarObjParaNC = async (factura) => {
  factura = factura[0];
  factura.datos = factura.detalle;
  factura.pagoMultiple = "";
  factura.formaDePago = factura.formaPago;
  let observaciones = JSON.parse(factura.observaciones);
  if(factura.formaPago === "multiple"){
      factura.pagoMultiple = JSON.stringify(observaciones.pagoMultiple);
  }
  return factura;
};

module.exports = {
    fechaHoy,
    fechaHyphen,
    fechaNormalizada,
    calcularFacturacionxFechaxLocal,
    crearResumenVistaLocal,
    checkDummy,
    crearReqAPIWSFE,
    crearReqAPIWSFEparaNC,
    fetchAPIWSFE,
    validarReq,
    ajustarObjParaNC,
}