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

    let totalDia = 0;
    let totalNF = 0;
    let totalCAE = 0;
    let totalEfectivo = 0;
    let totalDebito = 0;
    let totalCredito = 0;
    let totalNB = 0;
    let contadorOperaciones = 0;

    facturas.forEach((factura) => {
        if(factura.tipo === "S"){
            totalDia += factura.senia;
            totalNF += factura.senia;

            switch (factura.formaPago) {
                case "efectivo":
                    totalEfectivo += factura.senia;
                    break;
                case "debito":
                    totalDebito += factura.senia;
                    break;
                case "credito":
                    totalCredito += factura.senia;
                    break;
                case "transferencia":
                    totalNB += factura.senia;
                    break;
                case "multiple":
                    let pagoMultiple = JSON.parse(factura.observaciones);
                    pagoMultiple = pagoMultiple.pagoMultiple;
                    totalEfectivo += pagoMultiple.montoefectivo;
                    totalDebito += pagoMultiple.montodebito;
                    totalCredito += pagoMultiple.montocredito;
                    totalNB += pagoMultiple.montovirtual;
                    break;
                default:
                    break;
            }

            return;
        }
        if(factura.tipo === "X"){
            totalDia += factura.total;
            totalNF += factura.total;
            if(factura.senia > 0){
                totalDia -= factura.senia;
                totalNF -= factura.senia;
            }
            contadorOperaciones++;
        };
        if(factura.tipo === 1 || factura.tipo === 6 || factura.tipo === 11){
            totalDia += factura.total;
            totalCAE += factura.total;
            if(factura.senia > 0){
                totalDia -= factura.senia;
                totalCAE -= factura.senia;
            }
            contadorOperaciones++;
        }
        // Restar Notas de credito con y sin CAE
        switch (factura.formaPago) {
            case "efectivo":
                totalEfectivo += factura.total;
                totalEfectivo -= factura.senia;
                break;
            case "debito":
                totalDebito += factura.total;
                totalDebito -= factura.senia;
                break;
            case "credito":
                totalCredito += factura.total;
                totalCredito -= factura.senia;
                break;
            case "transferencia":
                totalNB += factura.total;
                totalNB -= factura.senia;
                break;
            case "multiple":
                let pagoMultiple = JSON.parse(factura.observaciones);
                pagoMultiple = pagoMultiple.pagoMultiple;
                totalEfectivo += pagoMultiple.montoefectivo;
                totalDebito += pagoMultiple.montodebito;
                totalCredito += pagoMultiple.montocredito;
                totalNB += pagoMultiple.montovirtual;
                break;
            default:
                break;
        }
    });

    let promedio = totalDia / contadorOperaciones

    let resumen = {
        totalDia: monetarizar(totalDia),
        totalNF: monetarizar(totalNF),
        totalCAE: monetarizar(totalCAE),
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