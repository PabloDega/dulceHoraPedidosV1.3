const servicesFacturacion = require(__basedir + "/src/services/facturacion");

const axios = require('axios');

const fs = require('fs')

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
    const facturasNF = await servicesFacturacion.getFacturasNFTodasxFecha(fecha);
    const facturasCAE = await servicesFacturacion.getFacturasCAETodasxFecha(fecha);
    const facturas = facturasNF.concat(facturasCAE);
    let factucionxLocal = [];
    locales.forEach((local) => {
        let datos = {};
        datos.local = local.nombre;
        datos.localId = local.id;
        let facturasLocal = facturas.filter((factura) => factura.local == local.id);
        // facturasLocal = facturasLocal.filter((factura) => factura.fecha == fecha);
        let total = 0;
        let operaciones = 0;
        let operacionesComanda = 0;
        let totalComanda = 0;
        let operacionesCAE = 0;
        let totalCAE = 0;
        let totalEfectivo = 0;
        facturasLocal.forEach((factura) => {
            if(factura.tipo === "X" || factura.tipo === 1 || factura.tipo === 6 || factura.tipo === 11){
                total += factura.total;
                operaciones++;
                if(factura.tipo === "X"){
                    operacionesComanda++;
                    totalComanda += factura.total;
                } else {
                    operacionesCAE++;
                    totalCAE += factura.total;
                }
                if(factura.formaPago === "efectivo"){
                    totalEfectivo += factura.total;
                } else if(factura.formaPago === "multiple"){
                    let pagoMultiple = JSON.parse(factura.observaciones);
                    if(pagoMultiple.efectivo){
                        totalEfectivo += pagoMultiple.montoefectivo;
                    }
                }
            } else if(factura.tipo === "NC" || factura.tipo === 3 || factura.tipo === 8 || factura.tipo === 13){
                total -= factura.total;
                operaciones--;
                if(factura.tipo === "NC"){
                    operacionesComanda--;
                    totalComanda -= factura.total;
                } else {
                    operacionesCAE--;
                    totalCAE -= factura.total;
                }
                if(factura.formaPago === "efectivo"){
                    totalEfectivo -= factura.total;
                } else if(factura.formaPago === "multiple"){
                    let pagoMultiple = JSON.parse(factura.observaciones);
                    if(pagoMultiple.efectivo){
                        totalEfectivo -= pagoMultiple.montoefectivo;
                    }
                }
            }
        });
        datos.total = total;
        datos.operaciones = operaciones;
        datos.totalCAE = totalCAE;
        datos.operacionesCAE = operacionesCAE;
        datos.totalComanda = totalComanda;
        datos.operacionesComanda = operacionesComanda;
        datos.totalEfectivo = totalEfectivo;
        factucionxLocal.push(datos);
    });
    return factucionxLocal;
}

const calcularStatsFacturacion = async (locales, productos) => {
    const facturasNF = await servicesFacturacion.getFacturasNFTodas();
    const facturasCAE = await servicesFacturacion.getFacturasCAETodas();
    const facturas = facturasNF.concat(facturasCAE);
    let factucionxLocal = [];
    await locales.forEach(async(local) => {
        let facturasLocal = facturas.filter((factura) => factura.local == local.id);
        if(facturasLocal === undefined){
            return;
        }
        let resumenDelLocal = await crearResumenFacturacionEstadisticas(facturasLocal, productos);
        let datos = {
            local: local.nombre,
            localId: local.id,
            facturacion: resumenDelLocal,
        };
        factucionxLocal.push(datos);
    })
    fs.writeFile("./log/stats.txt", JSON.stringify(factucionxLocal), (err) => {if(err){console.error(err)}})
    return factucionxLocal;

        /* let facturasLocal = facturas.filter((factura) => factura.local == local.id);

        let datos = {
            local: local.nombre,
            localId: local.id,
            facturacion: [],
        };
        let diasConFactura = new Set();
        facturasLocal.forEach((factura) => {
            diasConFactura.add(factura.fecha)
        });

        diasConFactura.forEach((dia) => {
            let facturasDeDia = facturasLocal.filter((factura) => factura.fecha == dia);
            let statsDelDia = {
                fecha: dia,
                total: 0,
                operaciones: 0,
                operacionesComanda: 0,
                totalComanda: 0,
                operacionesCAE: 0,
                totalCAE: 0,
                totalEfectivo: 0,
            }
            facturasDeDia.forEach((factura) => {
                if(factura.tipo === "X" || factura.tipo === 1 || factura.tipo === 6 || factura.tipo === 11){
                    statsDelDia.total += factura.total;
                    statsDelDia.operaciones++;
                    if(factura.tipo === "X"){
                        statsDelDia.operacionesComanda++;
                        statsDelDia.totalComanda += factura.total;
                    } else {
                        statsDelDia.operacionesCAE++;
                        statsDelDia.totalCAE += factura.total;
                    }
                    if(factura.formaPago === "efectivo"){
                        statsDelDia.totalEfectivo += factura.total;
                    } else if(factura.formaPago === "multiple"){
                        let pagoMultiple = JSON.parse(factura.observaciones);
                        if(pagoMultiple.efectivo){
                            statsDelDia.totalEfectivo += pagoMultiple.montoefectivo;
                        }
                    }
                } else if(factura.tipo === "NC" || factura.tipo === 3 || factura.tipo === 8 || factura.tipo === 13){
                    statsDelDia.total -= factura.total;
                    statsDelDia.operaciones--;
                    if(factura.tipo === "NC"){
                        statsDelDia.operacionesComanda--;
                        statsDelDia.totalComanda -= factura.total;
                    } else {
                        statsDelDia.operacionesCAE--;
                        statsDelDia.totalCAE -= factura.total;
                    }
                    if(factura.formaPago === "efectivo"){
                        statsDelDia.totalEfectivo -= factura.total;
                    } else if(factura.formaPago === "multiple"){
                        let pagoMultiple = JSON.parse(factura.observaciones);
                        if(pagoMultiple.efectivo){
                            statsDelDia.totalEfectivo -= pagoMultiple.montoefectivo;
                        }
                    }
                }
            });
            datos.facturacion.push(statsDelDia);
        });        
        factucionxLocal.push(datos);
    });
    return factucionxLocal; */
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
        contadorCAE: 0,
        contadorComanda: 0,
    }

    facturas.forEach((factura) => {
        if(factura.tipo === "X"){
            totales.totalDia += factura.total;
            totales.totalNF += factura.total;
            totales.contadorComanda++;
            totales = sumarFormaDePago(factura, totales);
        } else if(factura.tipo === "NC"){
            totales.totalDia -= factura.total;
            totales.totalNF -= factura.total;
            totales.contadorComanda--;
            totales = restarFormaDePagoNC(factura, totales)
        } else if(factura.tipo === 1 || factura.tipo === 6 || factura.tipo === 11){
            totales.totalDia += factura.total;
            totales.totalCAE += factura.total;
            totales.contadorCAE++;
            totales = sumarFormaDePago(factura, totales);
        } else if(factura.tipo === 3 || factura.tipo === 8 || factura.tipo === 13){
            totales.totalDia -= factura.total;
            totales.totalCAE -= factura.total;
            totales.contadorCAE--;
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
                totales.contadorComanda++;
            }
        }
    });

    let contadorOperaciones = totales.contadorCAE + totales.contadorComanda;
    let promedio = totales.totalDia / contadorOperaciones;
    
    let resumen = {
        totalDia: totales.totalDia,
        totalNF: totales.totalNF,
        totalCAE: totales.totalCAE,
        totalEfectivo: totales.totalEfectivo,
        totalDebito: totales.totalDebito,
        totalCredito: totales.totalCredito,
        totalNB: totales.totalNB,
        totalSeniado: totales.totalSeniado,
        contadorOperaciones: contadorOperaciones,
        promedio: promedio,
        contadorCAE: totales.contadorCAE,
        contadorComanda: totales.contadorComanda,
    }
    return resumen;
}

const crearResumenCajaLocal = async (facturas) => {
    // filtrar facturas si no es primer cierre

    let totales = {
        totalEfectivo: 0,
        totalDebito: 0,
        totalCredito: 0,
        totalNB: 0,
    }

    facturas.forEach((factura) => {
        if(factura.tipo === "X"){
            totales = sumarFormaDePago(factura, totales);
        } else if(factura.tipo === "NC"){
            totales = restarFormaDePagoNC(factura, totales);
        } else if(factura.tipo === 1 || factura.tipo === 6 || factura.tipo === 11){
            totales = sumarFormaDePago(factura, totales);
        } else if(factura.tipo === 3 || factura.tipo === 8 || factura.tipo === 13){
            totales = restarFormaDePagoNC(factura, totales);
        } else if(factura.tipo === "S"){
            let obs = JSON.parse(factura.observaciones);
            if(obs.estadoSenia === "cancelado" || obs.estadoSenia === "retirado"){
                return;
            } else {
                totales = sumarFormaDePagoSenia(factura, totales);
            }
        }
    });

    return totales;
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

const crearReqAPIWSFE = async (body, local, datosFiscales) => {
    let datos = {};
    datos.cuit = datosFiscales.cuit;
    datos.punto = datosFiscales.ptoventa;
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
    datos.formaDePago = body.formaDePago;
    datos.testing = local.testing;
    return datos
}

const crearReqAPIWSFEparaNC = async (datos, local, fechaCbte, datosFiscales) => {
    datos.cuit = datosFiscales.cuit;
    datos.punto = datosFiscales.ptoventa;
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
    datos.testing = local.testing;
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
        console.log("--> Error CAE: " + error);
        CAE = error;
    }
    return CAE;
}; 

const checkServerWSFE = async (testing) => {
    let estado;
    let data = {
        testing,
    }
    data = new URLSearchParams(data);
    const URL = `http://localhost:4004/wsfe/check/api`;
    try {
        estado = await axios.post(URL, data);
        // console.log("--> Respuesta CAE: " + JSON.stringify(respuesta.data));
    } catch (error) {
        console.log("--> Error Consulta Estado de Servidor Padron: " + error);
        return { error: false, msg: "error al consultar estado de servidor" };
    }
    return estado;
};

const checkServerPadron = async (testing) => {
    let estado;
    let data = {
        testing,
    }
    data = new URLSearchParams(data);
    const URL = `http://localhost:4004/padron/check/api`;
    try {
        estado = await axios.post(URL, data);
    } catch (error) {
        console.log("--> Error CAE: " + error);
        return { error: false, msg: "error al consultar servidor" };
    }
    return estado;
};

const consultarPadron = async (testing, idPersona, cuit) => {
    let infoPersona;
    let data = {
        testing,
        idPersona,
        cuit,
    }
    data = new URLSearchParams(data);
    const URL = `http://localhost:4004/padron/consultarPadron/api`;
    try {
        infoPersona = await axios.post(URL, data);
    } catch (error) {
        console.log("--> Error CAE: " + error);
        return { error: false, msg: "error al consultar el padron" };
    }
    return infoPersona;
};

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

const crearResumenFacturacionEstadisticas = async (facturas, productos) => {
    let fechas = new Set();
    let resumen = [];
    facturas.forEach((factura) => {
        fechas.add(factura.fecha);
    });
    fechas.forEach(async (dia) => {
        let facturasDelDia = facturas.filter((factura) => factura.fecha === dia);
        let resumenDelDia = await crearResumenVistaLocal(facturasDelDia);
        let detallePorHora = crearResumenVentasPorHora(facturasDelDia);
        let detalleDeProductos = crearResumenProductosEstadisticas(facturasDelDia, productos);
        resumenDelDia.fecha = dia;
        resumenDelDia.cronograma = detallePorHora;
        resumenDelDia.productos = detalleDeProductos;
        resumen.push(resumenDelDia);
    });
    return resumen;
}

const crearResumenVentasPorHora = (facturasDelDia) => {
    let respuestas = [];
    for (let i = 0; i < 24; i++) {
        let respuesta = {
            hora: i,
            total: 0,
            promedio: 0,
            operaciones: 0,
        }
        facturasDelDia.forEach((factura) => {
            let horaevento = new Date(factura.fechaevento).getHours();
            // testAdjust
            horaevento -= 3;
            if(horaevento == i){
                if(factura.tipo === "NC" || factura.tipo === 3 || factura.tipo === 8 || factura.tipo === 13){
                    respuesta.operaciones--;
                    respuesta.total -= factura.total;
                } else {
                    respuesta.operaciones++;
                    respuesta.total += factura.total;
                }
            }
        })
        if(respuesta.operaciones > 0){
            respuesta.promedio = Math.round((respuesta.total / respuesta.operaciones)*100)/100
        }
        respuestas.push(respuesta);
    }
    return respuestas;
}

const crearResumenProductosEstadisticas = (facturasDelDia, productos) => {
    let productosDelDia = [];
    facturasDelDia.forEach((factura) => {
        let detalle = JSON.parse(factura.detalle);
        detalle.forEach((item) => {
            // buscar prod en productosDelDia y si está sumarlo
            let buscarProd = productosDelDia.findIndex((prod) => prod[5] === item[5])
            if(buscarProd !== -1){
                if(factura.tipo === "NC" || factura.tipo === 3 || factura.tipo === 8 || factura.tipo === 13){
                    productosDelDia[buscarProd][1] -= item[1];
                    productosDelDia[buscarProd][4] -= item[4];
                } else {
                    productosDelDia[buscarProd][1] += item[1];
                    productosDelDia[buscarProd][4] += item[4];
                }
            } else {
                if(factura.tipo === "NC" || factura.tipo === 3 || factura.tipo === 8 || factura.tipo === 13){
                    return;
                }
                productosDelDia.push(item);
            }
        });
    });
    return productosDelDia;
}

module.exports = {
    fechaHoy,
    fechaHyphen,
    fechaNormalizada,
    calcularFacturacionxFechaxLocal,
    calcularStatsFacturacion,
    crearResumenVistaLocal,
    crearResumenCajaLocal,
    checkDummy,
    crearReqAPIWSFE,
    crearReqAPIWSFEparaNC,
    checkServerWSFE,
    fetchAPIWSFE,
    ajustarObjParaNC,
    checkServerPadron,
    consultarPadron,
    crearResumenFacturacionEstadisticas,
    crearResumenProductosEstadisticas,
}