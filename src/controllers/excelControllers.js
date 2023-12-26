const xl = require('excel4node');
const servicesProductosFabrica = require(__basedir + "/src/services/productosFabrica");

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

module.exports = {
    exportarExcelProduccion,
    exportarExcelReportePlanta,
}