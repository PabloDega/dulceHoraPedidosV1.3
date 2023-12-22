const fechasReportes = () => {
    function verFechaFiltro(fecha) {
        let year = fecha.getFullYear();
        let month = fecha.getMonth() + 1;
        let day = fecha.getDate();
        return day + "/" + month + "/" + year;
    }
      
    const fechaHoy = new Date();
    const diasDeReportes = [];
    const diasEnVista = 5;
    for(let i = 0; i < diasEnVista; i++){
    let diaI = new Date(
        fechaHoy.getFullYear(),
        fechaHoy.getMonth(),
        fechaHoy.getDate() + i,
      )
      diasDeReportes.push(verFechaFiltro(diaI));
    }
    // console.log(diasDeReportes);
    return diasDeReportes;
}

/* const totalesPorDia = (pedidos, productos) => {
    let pedidosFiltrado = {}
    // console.log(pedidos);
    for(const dia of Object.keys(pedidos)){
        // console.log(pedidos[dia])
        pedidosFiltrado[dia] = []
        pedidos[dia].forEach((pedido) => {
            pedidosFiltrado[dia].push(pedido.pedido);
        })
    };
    // console.log(pedidosFiltrado);
    let pedidosFiltradoCantidades = {}
    for(const dia of Object.keys(pedidosFiltrado)){
        // console.log(pedidosFiltrado[dia][0])
        pedidosFiltradoCantidades[dia] = [];
        productos.forEach((producto) => {
            let pedidoDelProducto = {}
            pedidoDelProducto.id = producto.id
            pedidoDelProducto.sector = producto.sector
            let cantidadPedida = 0;
            // console.log(pedidosFiltrado[dia])
            pedidosFiltrado[dia].forEach((pedido) => {
                pedido = JSON.parse(pedido)
                // console.log(pedido)
                pedido.forEach((item) => {
                    if(item[1] == producto.id){
                        cantidadPedida = cantidadPedida + item[0]
                        // console.log(producto.id, item[0])
                    }
                })
            })
            pedidoDelProducto.cantidad = cantidadPedida;
            
            pedidosFiltradoCantidades[dia].push(pedidoDelProducto)
        })
    }
    console.log(pedidosFiltradoCantidades);
    return pedidosFiltradoCantidades;
} */

const sumarPedidosMismaFecha = async(pedidos, locales) =>{
    let pedidoFiltrado = [];
    locales.forEach((local) => {
        let pedidosPorLocal = pedidos.filter((pedido) => pedido.local == local.id);
        console.log(pedidosPorLocal.length);
        if(pedidosPorLocal.length = 0){return};
        if(pedidosPorLocal.length = 1){pedidoFiltrado.push(pedidosPorLocal[0])}
        if(pedidosPorLocal.length > 1){}
    })
}

module.exports = {
    fechasReportes,
    sumarPedidosMismaFecha,
}