const xl = require('excel4node');

const exportarExcelProduccion = async(req, res) => {
    console.log(req.body)
    let wb = new xl.Workbook();
    let ws = wb.addWorksheet('Pedido Fabrica');
    ws.cell(1, 1).string("Planilla de Pedidos")
    ws.cell(2, 1).string("Fecha de entrega:");
    ws.cell(2, 2).string(req.body.fecha);
    ws.cell(3, 1).string("Local:");
    ws.cell(3, 2).string(req.body.local);
    ws.cell(4, 1).string("Pedido:");
    ws.cell(4, 2).string(req.body.pedido);

    wb.write(`Planilla de pedido ${req.body.local} - ${req.body.fecha}.xlsx`, res);
}

module.exports = {
    exportarExcelProduccion,
}