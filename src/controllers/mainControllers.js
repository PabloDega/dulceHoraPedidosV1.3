const servicesProductos = require(__basedir + "/src/services/productos");
const servicesLocal = require(__basedir + "/src/services/local");
const servicesFront = require(__basedir + "/src/services/front");
const servicesChat = require(__basedir + "/src/services/chat");
const actividad = require(__basedir + "/src/middlewares/actividad");
const generateUniqueId = require('generate-unique-id');

const jsonProductos = async (req, res) => {
  let data = await servicesProductos.getProductos();
  res.json(data);
  res.end();
};

const indexSelect = async(req, res) => {
  if(req.session.clientLocal != undefined){
    res.redirect("/pedidos");
  }
  let data = await servicesLocal.getLocalesFront();
  if(!req.session.clientId){
    req.session.clientId = generateUniqueId();
  }
  await actividad.actividadCliente(0, 0, req.session.clientId, "Landing", "");
  res.render(__basedir + "/src/views/front/localSelect", {
    data,
    showLocal: "no",
    showCart: "no",
    showPedido: "no",
    local: "",
    layout: __basedir + "/src/views/layouts/front",
  });
  res.status(200).end();
};

const volerIndexSelect = (req, res) => {
  req.session.clientLocal = undefined;
  res.clearCookie("pedido");
  return res.redirect("/");
}

const index = async(req, res) => {
  if(req.body.local == undefined && req.session.clientLocal == undefined){
    return res.redirect("/");
  }
  let localBody 
  if (req.body.local != undefined) {
    localBody = parseInt(req.body.local);
    if (isNaN(localBody)) {
      return res.redirect("/");
    }
  } else {
    localBody = req.session.clientLocal.id;
  }
  let data = await servicesProductos.getProductos();
  let local = await servicesLocal.getLocal(localBody);
  req.session.clientLocal = local;
  if(local == undefined){
    req.session.clientLocal = undefined;
    return res.redirect("/");
  }
  await actividad.actividadCliente(localBody, 0, req.session.clientId, "Ingreso", "");
  let prodActivos = await servicesFront.prodActivos(data, local);
  let categorias = await servicesFront.categorias(prodActivos);
  //verificar Pedido Activo
  let showPedido = "no";
  if(!!req.cookies.pedidoEnviado && local.id == req.cookies.pedidoEnviado.localId){
    showPedido = "si";
  }
  res.render(__basedir + "/src/views/front/index", {
    local,
    data,
    prodActivos,
    categorias,
    showLocal: "si",
    showCart: "si",
    showPedido,
    layout: __basedir + "/src/views/layouts/front",
  });
  res.status(200).end();
};

const carrito = async (req, res) => {
  if(req.body.local == undefined && req.session.clientLocal == undefined){
    return res.redirect("/");
  }
  let local = req.session.clientLocal;
  await actividad.actividadCliente(local.id, 0, req.session.clientId, "Carrito", "");
  let data = await servicesProductos.getProductos();
  //verificar Pedido Activo
  let showPedido = "no";
  if(!!req.cookies.pedidoEnviado && local.id == req.cookies.pedidoEnviado.localId){
    showPedido = "si"
  }
  res.render(__basedir + "/src/views/front/carrito", {
    data,
    prodActivos: "",
    local: req.session.clientLocal,
    pedido: req.cookies.pedido,
    showLocal: "si",
    showCart: "no",
    showPedido,
    layout: __basedir + "/src/views/layouts/front",
  });
  res.status(200).end();
}

const carritoEliminarItem = (req, res) => {
  let item = req.params.item[0];
  let pedido = JSON.parse(req.cookies.pedido);
  pedido.splice(item, 1);
  res.cookie("pedido", JSON.stringify(pedido), {
    encode: String,
  });
  res.redirect("/carrito");
}

const carritoVaciar = (req, res) => {
  res.clearCookie("pedido");
  res.redirect("/");
}

const enviarPedido = async (req, res) => {
  if(req.body.totalPedido == undefined){
    return res.redirect("/pedidos")
  }
  let total = parseInt(req.body.totalPedido);
  if(isNaN(total)){
    return res.redirect("/");
  }
  let pedido = await req.cookies.pedido.replaceAll(`"`, `'`);
  let localId = req.session.clientLocal.id;
  let pedidoNumero = await servicesFront.insertPedido(localId, pedido, total);
  await actividad.actividadCliente(req.session.clientLocal.id, pedidoNumero, req.session.clientId, "Pedido", "");
  res.cookie("pedidoEnviado", {pedidoNumero, localId, total, pedido}, {encode: String});
  res.clearCookie("pedido");
  res.redirect("pedido");
}

const verPedido = async(req, res) => {
  if(req.cookies.pedidoEnviado == undefined){
    return res.redirect("/pedidos")
  }
  let data = await servicesProductos.getProductos();
  let dato = req.cookies.pedidoEnviado;
  let dataMensajes = await servicesChat.getMensajes(dato.pedidoNumero);
  let pedido = dato.pedido.replaceAll(`'`, `"`);
  res.render(__basedir + "/src/views/front/pedido", {
    data,
    dataMensajes,
    localId: dato.localId,
    pedido,
    total: dato.total,
    pedidoNumero: dato.pedidoNumero,
    showLocal: "si",
    showCart: "no",
    showPedido: "no",
    local: req.session.clientLocal,
    layout: __basedir + "/src/views/layouts/front",
  });
  res.status(200).end();
}

const cancelarPedido = async(req, res) => {
  await actividad.actividadCliente(req.session.clientLocal.id, req.cookies.pedidoEnviado.pedidoNumero, req.session.clientId, "Cancelado", "");
  res.clearCookie("pedidoEnviado");
  res.redirect("/gracias");
}

const gracias = (req, res) => {
  localCookie = req.session.clientLocal,
  // req.session = undefined;
  res.render(__basedir + "/src/views/front/gracias", {
    showLocal: "si",
    showCart: "no",
    showPedido: "no",
    local: localCookie,
    layout: __basedir + "/src/views/layouts/front",
  })
  res.status(200).end()
};

module.exports = { 
  enviarPedido, 
  jsonProductos,
  indexSelect,
  volerIndexSelect,
  index,
  carrito,
  carritoEliminarItem,
  carritoVaciar,
  verPedido,
  cancelarPedido,
  gracias,
};
