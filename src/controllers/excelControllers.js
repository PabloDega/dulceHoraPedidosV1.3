const xl = require('excel4node');
const servicesProductosFabrica = require(__basedir + "/src/services/productosFabrica");
const servicesLocal = require(__basedir + "/src/services/local");
const servicesReportes = require(__basedir + "/src/services/reportes");
const reportesMiddleware = require(__basedir + "/src/middlewares/reportes");


const exportarExcelProduccion = async(req, res) => {
    const pedido = JSON.parse(req.body.pedido);
    const productos = await servicesProductosFabrica.getProductosFabrica();
    const categorias = await servicesProductosFabrica.getCategoriasFabrica();
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
        ws.cell(iProductos, 1, iProductos, 6, true).string(categoria.categoriaProduccion).style(estiloNegro);
        iProductos++;
        productos.forEach((producto) => {
            if(producto.categoria == categoria.categoriaProduccion){
                prodFiltrados.push(producto)
            }
        })
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
            })
        }
    })

    wb.write(`Reporte de Planta - ${req.body.sector} - ${req.body.fecha}.xlsx`, res);
}

const exportarExcelReportePedidos = async (req, res) => {
    const pedidos = JSON.parse(req.body.pedidos);
    let fecha = req.body.fecha;
    fecha = fecha.split("/")
    fecha = new Date(fecha[2], fecha[1] - 1, fecha[0])
    const categorias = await servicesProductosFabrica.getCategoriasFabrica();
    const locales = await servicesLocal.getLocales();
    const productos = await servicesProductosFabrica.getProductosFabrica();

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
    const categorias = await servicesProductosFabrica.getCategoriasFabrica();
    const productos = await servicesProductosFabrica.getProductosFabrica();
    const cantidadesPorProducto = await reportesMiddleware.cantidadesPorProducto(productos, pedidosFiltrados, req.body.sector);
  
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

    ws.cell(iPedidos, 1).date(fecha).style(estiloNegro);
    let colspan = 4;
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
    ws.cell(iPedidos, col).string("Precio").style(estiloBorde).style(estiloCentrado);
    ws.column(col).setWidth(14);
    col++;
    ws.cell(iPedidos, col).string("Importe Total").style(estiloBorde).style(estiloCentrado);
    ws.column(col).setWidth(14);
    iPedidos++;

    categorias.forEach((categoria) => {
        let pedidosDeCategoria = cantidadesPorProducto.filter((producto) => producto.categoria == categoria.categoriaProduccion);
        if(pedidosDeCategoria.length == 0){ return }
        ws.cell(iPedidos, 1, iPedidos, colspan,true).string(categoria.categoriaProduccion).style(estiloCentrado).style(estiloNegro);
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
            ws.cell(iPedidos, col).number(nombreProducto.costo).style(estiloBorde).style(estiloCentrado).style(estiloImporte);
            col++;
            let total = acumulador * nombreProducto.costo
            ws.cell(iPedidos, col).number(total).style(estiloBorde).style(estiloCentrado).style(estiloImporte);
            iPedidos++;
        });
    });

    wb.write(`Reporte Valorizado - ${req.body.sector} - ${req.body.fecha}.xlsx`, res);
}

module.exports = {
    exportarExcelProduccion,
    exportarExcelReportePlanta,
    exportarExcelReportePedidos,
    exportarExcelReporteValorizado,
}