const sumarPedidosMismaFecha = async(pedidos, locales) =>{
    let pedidosFiltrados = [];
    for(const local of locales) {
        let pedidosPorLocal = await pedidos.filter((pedido) => pedido.local == local.id);
        pedidosPorLocal = await pedidosPorLocal.filter((pedido) => pedido.estado == "aceptado" || pedido.estado == "entregado")
        if(pedidosPorLocal.length == 1){
            let pedidoAcumulado = await crearObjetoPedido(pedidosPorLocal);
            pedidoAcumulado.listaDeCostos = local.listacostosprimaria;
            pedidosFiltrados.push(pedidoAcumulado)
        } else if(pedidosPorLocal.length > 1){
            // sumar totales de mismo local
            let sumaDePedidos = [];
            // let totalAcumulado = 0;
            await pedidosPorLocal.forEach(async(pedido) => {
                sumaDePedidos = sumaDePedidos.concat(JSON.parse(pedido.pedido));
                // totalAcumulado += pedido.total;
            })
            sumaDePedidos = await resumirProductosRepetidos(sumaDePedidos);
            pedidosPorLocal[0].pedido = JSON.stringify(sumaDePedidos);
            let pedidoAcumulado = await crearObjetoPedido(pedidosPorLocal);
            pedidoAcumulado.listaDeCostos = local.listacostosprimaria;
            // pedidoAcumulado.total = totalAcumulado;
            pedidosFiltrados.push(pedidoAcumulado);
        }
    }
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
    // pedidoAcumulado.total = pedidosPorLocal[0].total;
    return pedidoAcumulado;
}

const reportePlanta = async(productos, pedidos, sector) => {
    pedidos = pedidos.filter((pedido) => pedido.estado == "aceptado" || pedido.estado == "entregado")
    if(pedidos.length === 0){
        return pedidos;
    }
    // Array con los id del sector
    const productosDelSector = productos.filter((producto) => producto.sector === sector);
    let idDelSector = [];
    productosDelSector.forEach((producto) => idDelSector.push(producto.id));
    // Join pedidos
    let pedidoLimpio;
    if(pedidos.length == 1){
        pedidoLimpio = JSON.parse(pedidos[0].pedido);
    }
    if(pedidos.length > 1){  
        let sumaDePedidos = [];
        await pedidos.forEach(async(pedido) => {
            sumaDePedidos = sumaDePedidos.concat(JSON.parse(pedido.pedido));
        })
        sumaDePedidos = await resumirProductosRepetidos(sumaDePedidos);
        pedidoLimpio = sumaDePedidos;
    }
    // filtrar por sector
    pedidoLimpio = pedidoLimpio.filter((pedido) => idDelSector.includes(pedido[1]))
    return pedidoLimpio;
}

const productosDelPedido = async(productos, data) => {
    let idDelPedido = [];
    if(data.length === 0){
        return idDelPedido;
    }
    data.forEach((dato) => idDelPedido.push(dato[1]));
    const productosDelPedido = productos.filter((producto) => idDelPedido.includes(producto.id));
    // agregar cantidades
    productosDelPedido.forEach((producto) => {
        let info = data.find((dato) => dato[1] == producto.id);
        producto.cantidad = info[0]
    })
    return productosDelPedido
}

const localesConPedido = async(pedidos) => {
    let localesConPedido = [];
    pedidos.forEach((pedido) => {
        localesConPedido.push(pedido.local);
    })
    return localesConPedido;
}

const cantidadesPorProducto = async(productos, pedidosFiltrados, sector) => {
    let cantidadesPorProducto = [];
    productos.forEach((producto) => {
        if(producto.sector !== sector){return}
        let x = false;
        //let precio = 0;
        let total = 0;
        let objeto = {};
        let cantidades = [];
        objeto.id = producto.id;
        objeto.categoria = producto.categoria;
        
        pedidosFiltrados.forEach((pedido) => {
            let pedidoDetalle = JSON.parse(pedido.pedido);
            let itemPedidoDetalle = pedidoDetalle.find((item) => item[1] == producto.id);
            if(itemPedidoDetalle === undefined){
                // return no?
                cantidades.push(0);
            } else {
                cantidades.push(itemPedidoDetalle[0]);
                //precio = itemPedidoDetalle[2];
                let monto = itemPedidoDetalle[2] * itemPedidoDetalle[0];
                total += monto;
                x = true;
            }
        })
        objeto.cantidades = cantidades;
        //objeto.precio = precio;
        objeto.total = total;
        if(x){
            cantidadesPorProducto.push(objeto);
        }
    })
    return cantidadesPorProducto;
}

const totalPorLocal = async (pedidosFiltrados, sector, productos) => {
    let totalPorLocal = [];
    pedidosFiltrados.forEach((pedido) => {
        let respuesta = {
            local: pedido.local,
            total: 0,
        }
        let pedidoDetalle = JSON.parse(pedido.pedido);
        pedidoDetalle.forEach((item) => {
            const producto = productos.find((prod) => prod.id === item[1]);
            if(!producto || producto.sector !== sector){return};
            let monto = item[2] * item[0];
            respuesta.total += monto;
        })
        totalPorLocal.push(respuesta)
    });
    return totalPorLocal;
}

module.exports = {
    sumarPedidosMismaFecha,
    reportePlanta,
    productosDelPedido,
    localesConPedido,
    cantidadesPorProducto,
    totalPorLocal,
}