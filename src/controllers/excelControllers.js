const xl = require('excel4node');
const servicesProductosFabrica = require(__basedir + "/src/services/productosFabrica");
const servicesLocal = require(__basedir + "/src/services/local");
const servicesReportes = require(__basedir + "/src/services/reportes");
const reportesMiddleware = require(__basedir + "/src/middlewares/reportes");
const produccionMiddleware = require(__basedir + "/src/middlewares/produccion");
const servicesCaja = require(__basedir + "/src/services/caja");
const servicesGastos = require(__basedir + "/src/services/gastos");
const gastosMiddleware = require(__basedir + "/src/middlewares/gastos");
const servicesProductos = require(__basedir + "/src/services/productos");

const exportarExcelProduccion = async(req, res) => {
    const pedido = JSON.parse(req.body.pedido);
    // console.log(pedido)
    const productos = await servicesProductosFabrica.getProductosFabricaHistoricos();
    const categorias = await servicesProductosFabrica.getCategoriasFabrica();
    // const categoriasHistoricas = await produccionMiddleware.getCategoriasDeProductos(req.body.pedido, productos);

    let wb = new xl.Workbook();

    //estilos
    let estiloNegro = wb.createStyle({
        font: {
          color: '#FFFFFF',
          size: 12,
          bold: true,
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#000000',
        },
        alignment: {
            horizontal: 'center',
        }
    });

    let estiloImporte = wb.createStyle({
        numberFormat: '$#,##0.00; ($#,##0.00); -',
    })

    let estiloCentrado = wb.createStyle({
        alignment: {
            horizontal: 'center',
        }
    })

    let ws = wb.addWorksheet('Planilla de Pedidos');

    //Setear anchos
    ws.column(1).setWidth(4);
    ws.column(2).setWidth(32);
    ws.column(3).setWidth(7);
    ws.column(4).setWidth(9);
    ws.column(5).setWidth(14);
    ws.column(6).setWidth(12);
    ws.column(8).setWidth(15);

    ws.cell(1, 1, 1, 6, true).string(req.body.local).style(estiloNegro).style({font: {size: 16,}});
    ws.cell(1, 8).string("Fecha de Entrega").style(estiloNegro);
    ws.cell(2, 8).string(req.body.fecha).style(estiloCentrado);
    ws.cell(3, 8).string("Pedido Nº:").style(estiloNegro);
    ws.cell(4, 8).string(req.body.id).style(estiloCentrado);
    ws.cell(2, 1).string("COD");
    ws.cell(2, 2).string("ARTICULO");
    ws.cell(2, 3).string("UNIDAD");
    ws.cell(2, 4).string("PRECIO");
    ws.cell(2, 5).string("CANTIDAD");
    ws.cell(2, 6).string("IMPORTE");

    let iProductos = 3

    categorias.forEach((categoria) => {
        let prodFiltrados = [];
        productos.forEach((producto) => {
            if(producto.categoria == categoria.categoriaProduccion){
                prodFiltrados.push(producto);
            }
        })
        if(prodFiltrados.length === 0){return}
        ws.cell(iProductos, 1, iProductos, 6, true).string(categoria.categoriaProduccion).style(estiloNegro);
        iProductos++;
        prodFiltrados.forEach((producto) => {
            let prodPedido = pedido.find((item) => item[1] == producto.id)
            let pedidoPrecio = 0;
            let pedidoCantidad = 0;
            if(prodPedido !== undefined){
                pedidoPrecio = prodPedido[2];
                pedidoCantidad = prodPedido[0];
            }
            let formulaMultiplicacion = "D" + iProductos + "*" + "E" + iProductos
            ws.cell(iProductos, 1).number(producto.codigo).style(estiloCentrado);
            ws.cell(iProductos, 2).string(producto.nombre);
            ws.cell(iProductos, 3).string(producto.unidad).style(estiloCentrado);
            ws.cell(iProductos, 4).number(pedidoPrecio).style(estiloImporte);
            ws.cell(iProductos, 5).number(pedidoCantidad).style(estiloCentrado);
            ws.cell(iProductos, 6).formula(formulaMultiplicacion).style(estiloImporte);
            iProductos++;
        })
    })

    ws.cell(iProductos, 1, iProductos, 5, true).string("IMPORTE REMITO").style(estiloNegro);
    let formulaSumafinal = "SUM(F4:F" + (iProductos - 1) + ")"
    ws.cell(iProductos, 6).formula(formulaSumafinal).style(estiloImporte).style({font:{bold:true,}});

    wb.write(`Planilla de pedido ${req.body.local} - ${req.body.fecha}.xlsx`, res);
}

const exportarExcelReportePlanta = async (req, res) => {
    const productos = JSON.parse(req.body.productos);
    let fecha = req.body.fecha;
    fecha = fecha.split("/")
    fecha = new Date(fecha[2], fecha[1] - 1, fecha[0])
    const categorias = await servicesProductosFabrica.getCategoriasFabrica();
    let wb = new xl.Workbook({
        dateFormat: 'dd/mm/yy',
    });

    //estilos
    let estiloNegro = wb.createStyle({
        font: {
          color: '#FFFFFF',
          size: 12,
          bold: true,
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#000000',
        },
        alignment: {
            horizontal: 'center',
        }
    });
    let estiloCentrado = wb.createStyle({
        alignment: {
            horizontal: 'center',
        }
    });
    let estiloBorde = wb.createStyle({
        border:{
            left:{
                style: "thin",
                color: "#000000",
            },
            right:{
                style: "thin",
                color: "#000000",
            },
            top:{
                style: "thin",
                color: "#000000",
            },
            bottom:{
                style: "thin",
                color: "#000000",
            }
        }
    });

    let ws = wb.addWorksheet('Reporte de Planta');

    //Setear anchos
    ws.column(1).setWidth(35);
    ws.column(2).setWidth(5);

    if(req.body.sector === "panificado"){
        const categoriasReportePlanta = await servicesReportes.getCategoriasReporte();
        let secciones = new Set();
        categoriasReportePlanta.forEach((categoria) => {
            secciones.add(categoria.seccion);
        })
        secciones = Array.from(secciones);
        await secciones.sort();
        let iProductos = 1
        secciones.forEach((dato) => {
            ws.cell(iProductos, 1).date(new Date(fecha)).style(estiloNegro).style({font: {size: 16,}});
            ws.cell(iProductos, 2).string("Total");
            iProductos++;
            categoriaDeSeccion = categoriasReportePlanta.filter((cat) => cat.seccion == dato);
            let ordenado = new Set();
            categoriaDeSeccion.forEach((categoria) => {
                ordenado.add(categoria.orden);
            })
            ordenado = Array.from(ordenado)
            ordenado.sort();
            ordenado.forEach((orden) => {
                categoriasEnOrden = categoriaDeSeccion.filter((categoria) => categoria.orden == orden)
                categoriasEnOrden.forEach((categoria) => {
                    // let productos = JSON.parse(categoria.productos);
                    let codigos = JSON.parse(categoria.productos);
                    let pedido = [];
                    codigos.forEach((codigo) => {
                        let pedidoDelCodigo = productos.filter((prod) => prod.codigo == codigo);
                        if(pedidoDelCodigo.length !== 1){
                            return
                        } else {
                            pedido.push(pedidoDelCodigo[0])
                        };
                    })
                    if(pedido.length > 0){
                        ws.cell(iProductos, 1, iProductos, 2, true).string(categoria.categoria).style(estiloNegro);
                        iProductos++;
                        pedido.forEach((item) => {
                            ws.cell(iProductos, 1).string(item.nombre).style(estiloBorde);
                            ws.cell(iProductos, 2).number(item.cantidad).style(estiloCentrado).style(estiloBorde);
                            iProductos++;
                        })
                    } else {
                        return;
                    }
                });
            });
            iProductos++;
        });
    } else {
        ws.cell(1, 1).date(new Date(fecha)).style(estiloNegro).style({font: {size: 16,}});
        ws.cell(1, 2).string("Total");
        let iProductos = 2
        categorias.forEach((categoria) => {
            let prodFiltrados = productos.filter((producto) => producto.categoria == categoria.categoriaProduccion);
            if(prodFiltrados.length > 0){
                ws.cell(iProductos, 1, iProductos, 2, true).string(categoria.categoriaProduccion).style(estiloNegro);
                iProductos++;
                prodFiltrados.forEach((producto) => {
                    ws.cell(iProductos, 1).string(producto.nombre).style(estiloBorde);
                    ws.cell(iProductos, 2).number(producto.cantidad).style(estiloCentrado).style(estiloBorde);
                    iProductos++;
                });
            };
        });
    };

    wb.write(`Reporte de Planta - ${req.body.sector} - ${req.body.fecha}.xlsx`, res);
}

const exportarExcelReportePedidos = async (req, res) => {
    const pedidos = JSON.parse(req.body.pedidos);
    let fecha = req.body.fecha;
    fecha = fecha.split("/")
    fecha = new Date(fecha[2], fecha[1] - 1, fecha[0])
    const categorias = await servicesProductosFabrica.getCategoriasFabrica();
    const locales = await servicesLocal.getLocales();
    const productos = await servicesProductosFabrica.getProductosFabricaHistoricos();

    let wb = new xl.Workbook({
        dateFormat: 'dd/mm/yy',
    });

    //estilos
    let estiloNegro = wb.createStyle({
        font: {
          color: '#FFFFFF',
          size: 12,
          bold: true,
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#000000',
        },
        alignment: {
            horizontal: 'center',
        }
    });
    let estiloCentrado = wb.createStyle({
        alignment: {
            horizontal: 'center',
        }
    });
    let estiloBorde = wb.createStyle({
        border:{
            left:{
                style: "thin",
                color: "#000000",
            },
            right:{
                style: "thin",
                color: "#000000",
            },
            top:{
                style: "thin",
                color: "#000000",
            },
            bottom:{
                style: "thin",
                color: "#000000",
            }
        }
    });

    let ws = wb.addWorksheet('Reporte de Pedidos');

    //Setear anchos
    ws.column(1).setWidth(7);
    ws.column(2).setWidth(35);
    ws.column(3).setWidth(10);

    let iPedidos = 1

    pedidos.forEach((pedido) => {
        let productosDelPedido = [];
        let detallePedido = JSON.parse(pedido.pedido);
        detallePedido.forEach((dato) => {
            productosDelPedido.push(productos.find((producto) => producto.id == dato[1]))
        })
        productosDelPedido = productosDelPedido.filter((producto) => producto.sector == req.body.sector)
        if(productosDelPedido.length == 0){
            return
        }
        productosDelPedido.forEach((producto) => {
            let info = detallePedido.find((dato) => dato[1] == producto.id);
            producto.cantidad = info[0]
        })
        const local = locales.find((local) => local.id == pedido.local)

        ws.cell(iPedidos, 1, iPedidos, 2, true).string(local.nombre).style(estiloNegro).style({font: {size: 16,}});
        ws.cell(iPedidos, 3).date(fecha).style(estiloNegro);
        iPedidos++;
        ws.cell(iPedidos, 1).string("COD").style(estiloBorde).style(estiloCentrado);
        ws.cell(iPedidos, 2).string("ARTICULO").style(estiloBorde).style(estiloCentrado);
        ws.cell(iPedidos, 3).string("CANT").style(estiloBorde).style(estiloCentrado);
        iPedidos++;

        categorias.forEach((categoria) => {
            let productosDeCategoria = productosDelPedido.filter((producto) => producto.categoria == categoria.categoriaProduccion);
            if(productosDeCategoria.length == 0){ return };

            ws.cell(iPedidos, 1, iPedidos, 3, true).string(categoria.categoriaProduccion).style(estiloNegro);
            iPedidos++;
            
            productosDeCategoria.forEach((producto) => {
                ws.cell(iPedidos, 1).number(producto.codigo).style(estiloBorde).style(estiloCentrado);
                ws.cell(iPedidos, 2).string(producto.nombre).style(estiloBorde);
                ws.cell(iPedidos, 3).number(producto.cantidad).style(estiloBorde).style(estiloCentrado);
                iPedidos++;
                
            });
        });
        iPedidos++;
        iPedidos++;
    });

    wb.write(`Reporte de Pedidos - ${req.body.sector} - ${req.body.fecha}.xlsx`, res);
}

const exportarExcelReporteValorizado = async(req, res) => {
    let fecha = req.body.fecha;
    fecha = fecha.split("/")
    fecha = new Date(fecha[2], fecha[1] - 1, fecha[0])
    const locales = await servicesLocal.getLocales();
    const pedidos = await servicesReportes.getReportes(req.body.fecha); 
    const pedidosFiltrados = await reportesMiddleware.sumarPedidosMismaFecha(pedidos, locales);
    const localesConPedido = await reportesMiddleware.localesConPedido(pedidosFiltrados);
    // const categorias = await servicesProductosFabrica.getCategoriasFabrica();
    const productos = await servicesProductosFabrica.getProductosFabricaHistoricos();
    const categoriasHistoricas = await produccionMiddleware.getCategoriasDeProductosArray(pedidosFiltrados, productos, req.body.sector);
    const cantidadesPorProducto = await reportesMiddleware.cantidadesPorProducto(productos, pedidosFiltrados, req.body.sector);
    const totalPorLocal = await reportesMiddleware.totalPorLocal(pedidosFiltrados, req.body.sector, productos);
    let wb = new xl.Workbook({
        dateFormat: 'dd/mm/yy',
    });

    //estilos
    let estiloNegro = wb.createStyle({
        font: {
          color: '#FFFFFF',
          size: 12,
          bold: true,
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#000000',
        },
        alignment: {
            horizontal: 'center',
        }
    });
    let estiloGris = wb.createStyle({
        font: {
          size: 12,
          bold: true,
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#CCCCCC',
        },
        alignment: {
            horizontal: 'center',
        }
    });
    let estiloCentrado = wb.createStyle({
        alignment: {
            horizontal: 'center',
        }
    });
    let estiloBorde = wb.createStyle({
        border:{
            left:{
                style: "thin",
                color: "#000000",
            },
            right:{
                style: "thin",
                color: "#000000",
            },
            top:{
                style: "thin",
                color: "#000000",
            },
            bottom:{
                style: "thin",
                color: "#000000",
            }
        }
    });
    let estiloImporte = wb.createStyle({
        numberFormat: '$#,##0.00; ($#,##0.00); -',
    })
    

    let ws = wb.addWorksheet('Reporte de Pedidos');

    //Setear anchos
    ws.column(1).setWidth(40);

    let iPedidos = 1
    let colPrecio;

    ws.cell(iPedidos, 1).date(fecha).style(estiloNegro);
    let colspan = 3;
    let col = 2;
    localesConPedido.forEach((local) => {
        colspan++;
        let nombreLocal = locales.find((dato) => dato.id == local);
        ws.cell(iPedidos, col).string(nombreLocal.nombre).style(estiloBorde).style(estiloGris);
        ws.column(col).setWidth(14);
        col++;
        
    })
    ws.cell(iPedidos, col).string("Cantidad Total").style(estiloBorde).style(estiloCentrado);
    ws.column(col).setWidth(14);
    col++;
    /* ws.cell(iPedidos, col).string("Precio").style(estiloBorde).style(estiloCentrado);
    ws.column(col).setWidth(14); 
    col++;*/
    ws.cell(iPedidos, col).string("Importe Total").style(estiloBorde).style(estiloCentrado);
    ws.column(col).setWidth(14);
    iPedidos++;

    categoriasHistoricas.forEach((categoria) => {
        let pedidosDeCategoria = cantidadesPorProducto.filter((producto) => producto.categoria == categoria);
        if(pedidosDeCategoria.length == 0){ return }
        ws.cell(iPedidos, 1, iPedidos, colspan,true).string(categoria).style(estiloCentrado).style(estiloNegro);
        iPedidos++;
        pedidosDeCategoria.forEach((pedido) => {
            let acumulador = 0;
            let col = 1;
            let nombreProducto = productos.find((producto) => producto.id == pedido.id);
            ws.cell(iPedidos, col).string(nombreProducto.nombre).style(estiloBorde).style(estiloCentrado);
            col++;
            pedido.cantidades.forEach((cantidad) => {
                acumulador = acumulador + cantidad;
                ws.cell(iPedidos, col).number(cantidad).style(estiloBorde).style(estiloCentrado);
                col++;
            })
            ws.cell(iPedidos, col).number(acumulador).style(estiloBorde).style(estiloCentrado);
            col++
            colPrecio = col;
            /* ws.cell(iPedidos, col).number(pedido.precio).style(estiloBorde).style(estiloCentrado).style(estiloImporte);
            col++; */
            //let total = acumulador * pedido.precio;
            ws.cell(iPedidos, col).number(pedido.total).style(estiloBorde).style(estiloCentrado).style(estiloImporte);
            iPedidos++;
        });
    });

    col = 2;

    localesConPedido.forEach((local) => {
        let total = totalPorLocal.find((total) => total.local === local);
        ws.cell(iPedidos, col).number(total.total).style(estiloBorde).style(estiloGris).style(estiloImporte);
        col++;
    })

    const colLetra = String.fromCharCode(96 + colPrecio)
    const ultimoTotal = iPedidos-1;
    const sumarTotales = `=sum(${colLetra}3:${colLetra}${ultimoTotal})`;
    ws.cell(iPedidos, colPrecio).formula(sumarTotales).style(estiloBorde).style(estiloImporte).style(estiloGris);

    wb.write(`Reporte Valorizado - ${req.body.sector} - ${req.body.fecha}.xlsx`, res);
}

const exportarExcelReporteCaja = async(req, res) => {
  if(!req.body.id || isNaN(parseInt(req.body.id))){
    return res.redirect(`/panel/local/caja/cierre?errores=2`);
  }

  let registro = await servicesCaja.getCierresxId(req.session.userLocal, req.body.id);
  if(registro.length !== 1){
    return res.redirect(`/panel/local/caja/cierre?errores=2`);
  } else if(registro[0].cierre === null){
    return res.redirect(`/panel/local/caja/cierre?errores=4`);
  }

  let fecha = registro[0].inicio;
  fecha = JSON.parse(fecha);
  fecha = fecha.fecha;
  const local = await servicesLocal.getLocal(req.session.userLocal);
  const gastos = await servicesGastos.getGastosxEvento(req.session.userLocal, fecha);
  const resumenGastos = await gastosMiddleware.crearResumenGastos(gastos);
  const productos = await servicesProductos.getProductosLocalTodos();
  const productosPersonalizados = await servicesProductos.getProductosPersonalizadosxLocal(req.session.userLocal);

  registro = registro[0]
  let apertura = JSON.parse(registro.inicio);
  let cierre = JSON.parse(registro.cierre);
  let reporte = JSON.parse(registro.reporte);
  
  let wb = new xl.Workbook({
    dateFormat: 'dd/mm/yy hh:mm:ss',
  });

  //estilos
  let estiloNegro = wb.createStyle({
    font: {
      color: '#FFFFFF',
      size: 12,
      bold: true,
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#000000',
    },
    alignment: {
        horizontal: 'center',
    }
  });
  let estiloGris = wb.createStyle({
      font: {
        size: 12,
        bold: true,
      },
      fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: '#CCCCCC',
      },
      alignment: {
          horizontal: 'center',
      }
  });
  let estiloCentrado = wb.createStyle({
      alignment: {
          horizontal: 'center',
      }
  });
  let estiloBorde = wb.createStyle({
      border:{
          left:{
              style: "thin",
              color: "#000000",
          },
          right:{
              style: "thin",
              color: "#000000",
          },
          top:{
              style: "thin",
              color: "#000000",
          },
          bottom:{
              style: "thin",
              color: "#000000",
          }
      }
  });
  let estiloImporte = wb.createStyle({
      numberFormat: '$#,##0.00; ($#,##0.00); -',
  })
  let estiloTitulo = wb.createStyle({
    font: {
      size: 16,
      bold: true,
      color: '#FFFFFF',
    },
  })
  
  // Hoja reporte
  let wsReporte = wb.addWorksheet('Reporte de Caja');

  //Setear anchos
  wsReporte.column(1).setWidth(20);
  wsReporte.column(2).setWidth(20);

  wsReporte.cell(1, 1, 1, 2, true).string(`Reporte de Caja Nº ${registro.numero}`).style(estiloNegro).style(estiloTitulo);
  wsReporte.cell(2, 1).string("Fecha de Apertura");
  wsReporte.cell(2, 2).date(apertura.fecha);
  wsReporte.cell(3, 1).string("Fecha de Cierre");
  wsReporte.cell(3, 2).date(cierre.fecha);
  wsReporte.cell(4, 1, 4, 2, true).string("Información General").style(estiloGris).style(estiloCentrado);
  wsReporte.cell(5, 1).string("Razon Social");
  wsReporte.cell(5, 2).string(local.nombre);
  wsReporte.cell(6, 1).string("Efectivo en apertura");
  wsReporte.cell(6, 2).number(apertura.efectivo + apertura.reservado).style(estiloImporte);
  wsReporte.cell(7, 1).string("Efectivo en cierre");
  wsReporte.cell(7, 2).number(cierre.efectivo + cierre.reservado).style(estiloImporte);
  wsReporte.cell(8, 1).string("Diferencia");
  wsReporte.cell(8, 2).formula("B7-B6").style(estiloImporte);
  wsReporte.cell(9, 1, 9, 2, true).string("Detalles").style(estiloGris).style(estiloCentrado);
  wsReporte.cell(10, 1).string("Cantidad de comandas");
  wsReporte.cell(10, 2).number(reporte.contadorComanda);
  wsReporte.cell(11, 1).string("Monto total comandas");
  wsReporte.cell(11, 2).number(reporte.totalNF).style(estiloImporte);
  wsReporte.cell(12, 1).string("Cantidad de tickets");
  wsReporte.cell(12, 2).number(reporte.contadorCAE);
  wsReporte.cell(13, 1).string("Monto total tickets");
  wsReporte.cell(13, 2).number(reporte.totalCAE).style(estiloImporte);
  wsReporte.cell(14, 1).string("Cantidad Total");
  wsReporte.cell(14, 2).formula("B10 + B12");
  wsReporte.cell(15, 1).string("Monto total");
  wsReporte.cell(15, 2).formula("B11+B13").style(estiloImporte);
  wsReporte.cell(16, 1, 16, 2, true).string("Medios de Pago").style(estiloGris).style(estiloCentrado);
  wsReporte.cell(17, 1).string("Efectivo");
  wsReporte.cell(17, 2).number(reporte.totalEfectivo).style(estiloImporte);
  wsReporte.cell(18, 1).string("Débito");
  wsReporte.cell(18, 2).number(reporte.totalDebito).style(estiloImporte);
  wsReporte.cell(19, 1).string("Crédito");
  wsReporte.cell(19, 2).number(reporte.totalCredito).style(estiloImporte);
  wsReporte.cell(20, 1).string("Virtual");
  wsReporte.cell(20, 2).number(reporte.totalNB).style(estiloImporte);
  wsReporte.cell(21, 1, 21, 2, true).string("Gastos y Retiros").style(estiloGris).style(estiloCentrado);
  wsReporte.cell(22, 1).string("Gastos");
  wsReporte.cell(22, 2).number(resumenGastos.gastos).style(estiloImporte);
  wsReporte.cell(23, 1).string("Retiros");
  wsReporte.cell(23, 2).number(resumenGastos.retiros).style(estiloImporte);

  // Hoja detalle
  let wsDetalle = wb.addWorksheet('Detalle de Ventas');

  //Setear anchos
  wsDetalle.column(1).setWidth(8);
  wsDetalle.column(2).setWidth(9);
  wsDetalle.column(3).setWidth(30);
  wsDetalle.column(4).setWidth(12);

  wsDetalle.cell(1, 1, 1, 4, true).string(`Detalle de productos vendidos`).style(estiloNegro).style(estiloTitulo);
  wsDetalle.cell(2, 1).string("Cantidad").style(estiloGris).style(estiloCentrado);
  wsDetalle.cell(2, 2).string("Frac.").style(estiloGris).style(estiloCentrado);
  wsDetalle.cell(2, 3).string("Producto").style(estiloGris).style(estiloCentrado);
  wsDetalle.cell(2, 4).string("Total").style(estiloGris).style(estiloCentrado);
  let iDetalle = 3;

  reporte.detalleVentasCaja.forEach((item) => {

    let fraccionamiento = "Unidad";
    let producto;
    if(item[0] > 99){
        producto = productos.find((prod) => prod.id == item[1]);
        if(producto.fraccionamiento == "kilo"){
            fraccionamiento = "kilo";
            item[2] = item[2]/1000
        }
    } else if(item[0] < 100){
        producto = productosPersonalizados.find((prod) => prod.id == item[1]);
    }
    if(producto === undefined){
        console.log(`Error al buscar producto en Reporte de Caja para codigo ${item[0]} / usuario: ${usuario}`)
        return;
    }

    wsDetalle.cell(iDetalle, 1).number(item[2]).style(estiloBorde).style(estiloCentrado);
    wsDetalle.cell(iDetalle, 2).string(fraccionamiento).style(estiloBorde);
    wsDetalle.cell(iDetalle, 3).string(producto.nombre).style(estiloBorde);
    wsDetalle.cell(iDetalle, 4).number(item[3]).style(estiloImporte).style(estiloBorde);

    iDetalle++;
  });

  wsDetalle.cell(iDetalle, 4).formula(`SUM(D3:D${iDetalle - 1})`).style(estiloImporte).style(estiloBorde);

  wb.write(`Reporte de Caja - ${registro.numero} - ${apertura.fecha}.xlsx`, res);
}

module.exports = {
    exportarExcelProduccion,
    exportarExcelReportePlanta,
    exportarExcelReportePedidos,
    exportarExcelReporteValorizado,
    exportarExcelReporteCaja,
}