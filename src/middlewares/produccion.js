const getUltimosPedidos = async(data) => {
  let ultimosPedidos = {
    fecha1: "1/1/2000",
    estado1: "Entregado",
    fecha2: "1/1/2000",
    estado2: "Entregado",
  }
  if(data.length > 0){
    ultimosPedidos.fecha1 = data[data.length-1].fechaentrega;
    ultimosPedidos.estado1 = data[data.length-1].estado;
  }
  if(data.length > 1){
    ultimosPedidos.fecha2 = data[data.length-2].fechaentrega;
    ultimosPedidos.estado2 = data[data.length-2].estado;
  }
  return ultimosPedidos;
}

const getFechasProduccionLocal = (diasEntrega, ultimosPedidos, fechaUltimoPedido, estadoUltimoPedido) => {

  function verFechaFiltro(fecha) {
    let year = fecha.getFullYear();
    let month = fecha.getMonth() + 1;
    let day = fecha.getDate();
    return day + "/" + month + "/" + year;
  }

  let diasDeEntrega = JSON.parse(diasEntrega);
  let fechaHoy = new Date();

  //buscar dia de proxima entrega
  let proximaEntrega;
  let diasRestanteProxEntrega;
  let plusSegundaFecha;
  let fechaEntregaActiva = 0;
  for (let i = 0; i < diasDeEntrega.length; i++) {
    if (fechaHoy.getDay() <= diasDeEntrega[i]) {
      proximaEntrega = diasDeEntrega[i];
      diasRestanteProxEntrega = diasDeEntrega[i] - fechaHoy.getDay();
      if (i + 1 == diasDeEntrega.length) {
        plusSegundaFecha = diasDeEntrega[0] + 7 - diasDeEntrega[i];
      } else {
        plusSegundaFecha = diasDeEntrega[i + 1] - diasDeEntrega[i];
      }
      break;
    }
  }
  if (proximaEntrega == undefined) {
    proximaEntrega = diasDeEntrega[0];
    diasRestanteProxEntrega = diasDeEntrega[0] + 7 - fechaHoy.getDay();
    plusSegundaFecha = diasDeEntrega[1] - diasDeEntrega[0];
  }

  // Setear fecha de proxima entrega
  let fechaEntregaPedido = new Date(
    fechaHoy.getFullYear(),
    fechaHoy.getMonth(),
    fechaHoy.getDate() + diasRestanteProxEntrega,
    12
  );
  let fechaEntregaProxPedido = new Date(
    fechaHoy.getFullYear(),
    fechaHoy.getMonth(),
    fechaHoy.getDate() + diasRestanteProxEntrega + plusSegundaFecha,
    12
  );
  // verifica cuanto falta para la proxima entrega (hrs) y determina el estado
  let horasRestanteEntregaPedido = (fechaEntregaPedido - fechaHoy) / 1000 / 60 / 60;
  let pedidoEstado;
  if (verFechaFiltro(fechaEntregaPedido) == ultimosPedidos.fecha1) {
    pedidoEstado = ultimosPedidos.estado1;
  } else if (verFechaFiltro(fechaEntregaPedido) == ultimosPedidos.fecha2) {
    pedidoEstado = ultimosPedidos.estado2;
  } else if (horasRestanteEntregaPedido > 72) {
    pedidoEstado = "proximo";
  } else if (horasRestanteEntregaPedido > 52) {
    pedidoEstado = "abierto";
    fechaEntregaActiva = verFechaFiltro(fechaEntregaPedido);
  } else if (horasRestanteEntregaPedido > 48) {
    pedidoEstado = "demorado";
    fechaEntregaActiva = verFechaFiltro(fechaEntregaPedido);
  } else {
    pedidoEstado = "aplazado";
  }
  // habilita estado para el pedido siguiente en base al analisis anterior
  let horasRestanteEntregaProximoPedido = (fechaEntregaProxPedido - fechaHoy) / 1000 / 60 / 60;
  let proximoPedidoEstado;
  if (verFechaFiltro(fechaEntregaProxPedido) == ultimosPedidos.fecha1) {
    proximoPedidoEstado = ultimosPedidos.estado1;
  } else if (verFechaFiltro(fechaEntregaProxPedido) == ultimosPedidos.fecha2) {
    proximoPedidoEstado = ultimosPedidos.estado2;
  } else if (horasRestanteEntregaProximoPedido > 72) {
    proximoPedidoEstado = "proximo";
  } else if (horasRestanteEntregaProximoPedido > 52) {
    proximoPedidoEstado = "abierto";
    fechaEntregaActiva = verFechaFiltro(fechaEntregaProxPedido);
  } else if (horasRestanteEntregaProximoPedido > 48) {
    proximoPedidoEstado = "demorado";
    fechaEntregaActiva = verFechaFiltro(fechaEntregaProxPedido);
  } else {
    proximoPedidoEstado = "aplazado";
  }

  let fechas = {
    fechaHoy,
    fechaEntregaPedido,
    pedidoEstado,
    horasRestanteEntregaPedido: Math.trunc(horasRestanteEntregaPedido) - 48,
    fechaEntregaProxPedido,
    proximoPedidoEstado,
    fechaEntregaActiva,
    horasRestanteEntregaProximoPedido: Math.trunc(horasRestanteEntregaProximoPedido) - 48,
  };
  return fechas;
};



module.exports = {
  getFechasProduccionLocal,
  getUltimosPedidos,
};
