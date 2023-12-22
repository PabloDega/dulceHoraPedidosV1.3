const sumarPedidosMismaFecha = async(pedidos, locales) =>{
    let pedidosFiltrados = [];
    for(const local of locales) {
        let pedidosPorLocal = await pedidos.filter((pedido) => pedido.local == local.id);
        pedidosPorLocal = await pedidosPorLocal.filter((pedido) => pedido.estado == "aceptado" || pedido.estado == "entregado")
        if(pedidosPorLocal.length == 1){
            let pedidoAcumulado = await crearObjetoPedido(pedidosPorLocal);
            pedidosFiltrados.push(pedidoAcumulado)
        } else if(pedidosPorLocal.length > 1){
            let sumaDePedidos = [];
            await pedidosPorLocal.forEach(async(pedido) => {
                sumaDePedidos = sumaDePedidos.concat(JSON.parse(pedido.pedido));
            })
            sumaDePedidos = await resumirProductosRepetidos(sumaDePedidos);
            pedidosPorLocal[0].pedido = JSON.stringify(sumaDePedidos);
            let pedidoAcumulado = await crearObjetoPedido(pedidosPorLocal);
            pedidosFiltrados.push(pedidoAcumulado);
        }
    }
    console.log(pedidosFiltrados);
    return pedidosFiltrados;
}

const resumirProductosRepetidos = async(sumaDePedidos) => {
    let pedidoUnido = [];
    let productosDelPedido = [];
    sumaDePedidos.forEach((pedido) => productosDelPedido.push(pedido[1]));
    let productosUnicos = Array.from(new Set(productosDelPedido));
    productosUnicos.forEach((producto) => {
        let productoRepetido = sumaDePedidos.filter((pedido) => pedido[1] == producto);
        if(productoRepetido.length == 1){
            pedidoUnido.push(productoRepetido[0]);
        }
        if(productoRepetido.length > 1){
            let productosUnidos = [];
            let cantidad = 0;
            productoRepetido.forEach((producto) => {
                cantidad = cantidad + producto[0];
            })
            productosUnidos.push(cantidad);
            productosUnidos.push(productoRepetido[0][1]);
            productosUnidos.push(productoRepetido[0][2]);
            pedidoUnido.push(productosUnidos);
        }
    })
    return pedidoUnido;
}

const crearObjetoPedido = async(pedidosPorLocal) => {
    let pedidoAcumulado = {};
    pedidoAcumulado.fechaentrega = pedidosPorLocal[0].fechaentrega;
    pedidoAcumulado.local = pedidosPorLocal[0].local;
    pedidoAcumulado.pedido = pedidosPorLocal[0].pedido;
    return pedidoAcumulado;
}

module.exports = {
    sumarPedidosMismaFecha,
}