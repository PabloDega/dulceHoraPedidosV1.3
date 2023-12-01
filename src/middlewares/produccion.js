const getFechasProduccionLocal = (diasEntrega, fechaUltimoPedido) => {
  
  function verFechaFiltro(fecha) {
    let year = fecha.getFullYear();
    let month = fecha.getMonth() + 1;
    let day = fecha.getDate();
    return day + "/" + month + "/" + year;
  }

  let diasDeEntrega = JSON.parse(diasEntrega);
  let fechaHoy = new Date(2023, 10, 26, 12, 25);

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
  var fechaEntregaPedido = new Date(
    fechaHoy.getFullYear(),
    fechaHoy.getMonth(),
    fechaHoy.getDate() + diasRestanteProxEntrega,
    12
  );
  var fechaEntregaProxPedido = new Date(
    fechaHoy.getFullYear(),
    fechaHoy.getMonth(),
    fechaHoy.getDate() + diasRestanteProxEntrega + plusSegundaFecha,
    12
  );
  // verifica cuanto falta para la proxima entrega (hrs) y determina si el pedido para la proxima fecha esta pendiente, abierto o cerrado
  let horasRestanteEntregaPedido = (fechaEntregaPedido - fechaHoy) / 1000 / 60 / 60;
  var pedidoEstado;
  if(verFechaFiltro(fechaEntregaPedido) == fechaUltimoPedido){
    pedidoEstado = "cargado";
  } else if (horasRestanteEntregaPedido > 72) {
    pedidoEstado = "pendiente";
  } else if (horasRestanteEntregaPedido > 48) {
    pedidoEstado = "abierto";
    fechaEntregaActiva = verFechaFiltro(fechaEntregaPedido);
  } else {
    pedidoEstado = "cerrado";
  }
  // habilita estado para el pedido siguiente en base al analisis anterior
  let horasRestanteEntregaProximoPedido = (fechaEntregaProxPedido - fechaHoy) / 1000 / 60 / 60;
  let proximoPedidoEstado = "pendiente";
  if (pedidoEstado == "cerrado" || pedidoEstado == "cargado") {
    if(verFechaFiltro(fechaEntregaProxPedido) == fechaUltimoPedido){
      proximoPedidoEstado = "cargado";
    } else if (horasRestanteEntregaProximoPedido > 72) {
      proximoPedidoEstado = "pendiente";
    } else if (horasRestanteEntregaProximoPedido > 48) {
      proximoPedidoEstado = "abierto";
      fechaEntregaActiva = verFechaFiltro(fechaEntregaProxPedido);
    } else {
      proximoPedidoEstado = "cerrado";
    }
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
};
