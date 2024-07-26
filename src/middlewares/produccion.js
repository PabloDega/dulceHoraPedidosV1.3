/* function verFechaFiltro(fecha) {
  let year = fecha.getFullYear();
  let month = fecha.getMonth() + 1;
  let day = fecha.getDate();
  return day + "/" + month + "/" + year;
} */

let nDias = 7;
let horaCorte = 15;
// testAdjust
horaCorte = 11;

async function crearObjetoCalendario(fecha){
  let objeto = {};
  objeto.fecha = new Date(fecha);
  objeto.dia = fecha.getDay();
  return objeto;
}

async function agregarLocalesConEntrega(objetoFecha, locales){
  objetoFecha.locales = [];
  locales.forEach((local) => {
    let servicios = JSON.parse(local.servicios);
    if(!servicios.pedidos){
      return
    }
    let dias = JSON.parse(local.entrega);
    let checkEntrega = dias.findIndex((dia) => dia == objetoFecha.dia);
    if(checkEntrega !== -1){
      objetoFecha.locales.push(local.id);
    }
  })
  return objetoFecha;
}

async function calcularEstadoPedido(objetoFecha, horaCorte){
  let ahora = new Date();
  
  //testAdjust
  ahora.setHours(ahora.getHours() - 3);

  let estadoDelPedido;
  let fechaBase = new Date(objetoFecha.fecha);
  fechaBase.setHours(horaCorte);
  fechaBase.setMinutes(0);
  fechaBase.setSeconds(0);
  let fechaApertura = new Date(fechaBase);
  fechaApertura.setDate(fechaApertura.getDate() - 3);
  objetoFecha.fechaApertura = fechaApertura;
  let fechaCierre = new Date(fechaBase);
  fechaCierre.setDate(fechaCierre.getDate() - 2);
  objetoFecha.fechaCierre = fechaCierre;
  let fechaDemorada = new Date(fechaBase);
  fechaDemorada.setDate(fechaDemorada.getDate() - 2);
  fechaDemorada.setHours(horaCorte - 2);
  objetoFecha.fechaDemorada = fechaDemorada;
  if(ahora < fechaApertura){
    estadoDelPedido = "proximo";
  } else if(ahora < fechaCierre){
    estadoDelPedido = "abierto";
    /* if(ahora > fechaDemorada){
      estadoDelPedido = "demorado";
    } */
  } else {
    estadoDelPedido = "cerrado";
  }
  objetoFecha.estado = estadoDelPedido;
  
  return objetoFecha;
}

const getCalendarioEntregas = async (locales) => {
  let calendarioDeEntregas = [];

  let fecha = new Date();

  // testAdjust
  fecha.setHours(fecha.getHours() - 3);

  for (let i = 0; i < nDias; i++) {
    let objetoFecha = await crearObjetoCalendario(fecha);
    objetoFecha = await agregarLocalesConEntrega(objetoFecha, locales);
    objetoFecha = await calcularEstadoPedido(objetoFecha, horaCorte);
    calendarioDeEntregas.push(objetoFecha);
    fecha = new Date(fecha.setDate(fecha.getDate() + 1));
  }

  return calendarioDeEntregas;
}

const getCalendarioEntregasLocal = async (calendarioEntregas, local, produccion) => {
  let calendarioDeEntregasLocal = [];
  calendarioEntregas.forEach((dia) => {
    let checkLocal = dia.locales.findIndex((item) => item == local);
    if(checkLocal !== -1){
      calendarioDeEntregasLocal.push(dia);
    }
  });
  // Agregar posible pedido personalizado
  calendarioDeEntregasLocal = await filtrarPedidosFueraDeCalendario(calendarioDeEntregasLocal, produccion);
  
  return calendarioDeEntregasLocal;
}

async function filtrarPedidosFueraDeCalendario(calendarioDeEntregasLocal, produccion){
  // crear fechas de pedidos visualizados
  const fechaBase = new Date();
  fechaBase.setHours(horaCorte);
  fechaBase.setMinutes(0);
  fechaBase.setSeconds(0);
  const fechaFin = new Date();
  fechaFin.setDate(fechaFin.getDate() + nDias)
  // filtrar obj produccion en base a las fechas
  let pedidosFiltrados = produccion.filter((prod) => {
    let fechaArray = prod.fechaentrega.split("/");
    return new Date(fechaArray[2], fechaArray[1] - 1, fechaArray[0]) > fechaBase;
  })
  // comparar fechas con los pedidos de calendario
  let fechasDeCalendario = [];
  calendarioDeEntregasLocal.forEach((dia) => fechasDeCalendario.push(dia.fecha.getDate()));
  pedidosFiltrados = pedidosFiltrados.filter((pedido) => {
    let fechaPedido = pedido.fechaentrega.split("/");
    fechaPedido = new Date(fechaPedido[2], fechaPedido[1] - 1, fechaPedido[0]);
    let buscar = fechasDeCalendario.findIndex((fecha) => fecha == fechaPedido.getDate());
    return buscar === -1;
  });
  // crear objetos de calendario con los pedidos
  pedidosFiltrados.forEach((pedido) => {
    let fechaPedido = pedido.fechaentrega.split("/");
    fechaPedido = new Date(fechaPedido[2], fechaPedido[1] - 1, fechaPedido[0])
    let objetoCalendario = {
      fecha: fechaPedido,
    }
    calendarioDeEntregasLocal.push(objetoCalendario);
  });
  // ordenar array
  calendarioDeEntregasLocal.sort((a, b) => a.fecha - b.fecha)
  return calendarioDeEntregasLocal;
}

/* const getFechasProduccionLocal = (diasEntrega, pedidosLocal) => {

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
  // reemplazar los 2 primeros ondicionales por un if con un find sobre array completo de consulta sobre pedidos del local
  let pedidoCalendario1 = pedidosLocal.find((pedido) => pedido.fechaentrega == verFechaFiltro(fechaEntregaPedido));
  if (pedidoCalendario1 !== undefined) {
    pedidoEstado = pedidoCalendario1.estado;
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
  // reemplazar los 2 primeros ondicionales por un if con un find sobre array completo de consulta sobre pedidos del local
  let pedidoCalendario2 = pedidosLocal.find((pedido) => pedido.fechaentrega == verFechaFiltro(fechaEntregaProxPedido));
  if (pedidoCalendario2 !== undefined) {
    proximoPedidoEstado = pedidoCalendario2.estado;
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
}; */

const fechaProduccionNormalizada = async(info) => {
  let fechaArray = info.split("-")
  let year = parseInt(fechaArray[0]);
  let month = parseInt(fechaArray[1]);
  let day = parseInt(fechaArray[2]);
  return day + "/" + month + "/" + year;
}

const getCategoriasDeProductos = async (pedido, productos) => {
  pedido = JSON.parse(pedido);
  let categoriasPedido = new Set();
  pedido.forEach((item) => {
    let datosProducto = productos.find((prod) => prod.id == item[1]);
    categoriasPedido.add(datosProducto.categoria)
  })
  return categoriasPedido;
}

const getCategoriasDeProductosArray = async(pedidos, productos, sector) => {
  let categoriasPedido = new Set();
  pedidos.forEach((pedido) => {
    pedido = JSON.parse(pedido.pedido);
    pedido.forEach((item) => {
      let datosProducto = productos.find((prod) => prod.id == item[1]);
      if(datosProducto.sector !== sector){return}
      categoriasPedido.add(datosProducto.categoria);
    })
  })
  return categoriasPedido;
}

const parseFiltrosTablaProduccion = async (filtrosQuery, filtrosDisponibles) => {
  let respuesta = {};
  let filtros = [];
  let validacion = true;
  if(filtrosQuery !== undefined){
    if(typeof(filtrosQuery) != "object"){
      filtros.push(filtrosQuery);
    } else {
      filtros = filtrosQuery;
    }
  }
  respuesta.filtros = filtros;
  // validar querys
  if(respuesta.filtros.length == 0){
    validacion = false;
  } else {
    filtros.forEach((dato) => {
      let busqueda = filtrosDisponibles.findIndex((filtDisp) => filtDisp === dato);
      if(busqueda < 0){
        respuesta.filtros = [];
        validacion = false;
      }
    });
  }
  
  respuesta.validacion = validacion;
  return respuesta;
};

 const checkPedidoAbierto = async (calendarioEntregasLocal) => {
  let pedidoAbierto = calendarioEntregasLocal.find((pedido) => pedido.estado === "abierto");
  let resp = {
    estado: false,
  };
  if(pedidoAbierto === undefined){
    return resp;
  } else if(pedidoAbierto.length !== 0){
    resp.estado = true;
    resp.fecha = new Date(pedidoAbierto.fecha)
  }
  return resp;
 }

module.exports = {
  //getFechasProduccionLocal,
  fechaProduccionNormalizada,
  getCategoriasDeProductos,
  getCategoriasDeProductosArray,
  parseFiltrosTablaProduccion,
  getCalendarioEntregas,
  getCalendarioEntregasLocal,
  checkPedidoAbierto,
};
