const servicesProductos = require(__basedir + "/src/services/productos");
const servicesProductosFabrica = require(__basedir + "/src/services/productosFabrica");
const servicesLocal = require(__basedir + "/src/services/local");
const servicesUsuarios = require(__basedir + "/src/services/usuarios");
const servicesPedidos = require(__basedir + "/src/services/pedidos");
const servicesChat = require(__basedir + "/src/services/chat");
const servicesActividad = require(__basedir + "/src/services/actividad");
const servicesProduccion = require(__basedir + "/src/services/produccion")
const { validationResult } = require("express-validator");
const { hashearPassword } = require(__basedir + "/src/middlewares/hash");
const actividadMiddleware = require(__basedir + "/src/middlewares/actividad");
const produccionMiddleware = require(__basedir + "/src/middlewares/produccion");

const index = (req, res) => {
  res.render(__basedir + "/src/views/pages/panel", {
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosCard = async (req, res) => {
  let data = await servicesProductos.getProductos();
  res.render(__basedir + "/src/views/pages/productos", {
    data,
    vista: "card",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosTabla = async (req, res) => {
  let data = await servicesProductos.getProductos();
  res.render(__basedir + "/src/views/pages/productos", {
    data,
    vista: "tabla",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosEditar = async (req, res) => {
  let dataCategorias = await servicesProductos.getCategorias();
  let id = req.query.id;
  let data = await servicesProductos.getProducto(id);
  res.render(__basedir + "/src/views/pages/editarProducto", {
    data,
    dataCategorias,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosUpdate = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    let dataCategorias = await servicesProductos.getCategorias();
    return res.render(__basedir + "/src/views/pages/editarProducto", {
      dataCategorias,
      data: req.body,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  let datos = req.body;
  await servicesProductos.updateProducto(datos);
  let data = await servicesProductos.getProductos();
  res.render(__basedir + "/src/views/pages/productos", {
    data,
    vista: "card",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosNuevo = async (req, res) => {
  let dataCategorias = await servicesProductos.getCategorias();
  let lastId = await servicesProductos.lastId("productos");
  res.render(__basedir + "/src/views/pages/nuevoProducto", {
    lastId,
    dataCategorias,
    data: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosInsert = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    let dataCategorias = await servicesProductos.getCategorias();
    return res.render(__basedir + "/src/views/pages/nuevoProducto", {
      dataCategorias,
      lastId: req.body.id,
      data: req.body,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  let datos = req.body;
  await servicesProductos.insertProducto(datos);
  let data = await servicesProductos.getProductos();
  res.render(__basedir + "/src/views/pages/productos", {
    data,
    vista: "card",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosEliminar = async (req, res) => {
  let id = req.query.id;
  await servicesProductos.deleteProducto(id);
  let data = await servicesProductos.getProductos();
  res.render(__basedir + "/src/views/pages/productos", {
    data,
    vista: "card",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const categoriasTabla = async (req, res) => {
  let data = await servicesProductos.getCategorias();
  res.render(__basedir + "/src/views/pages/categorias", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const categoriasNueva = async (req, res) => {
  let data = await servicesProductos.lastId("categorias");
  res.render(__basedir + "/src/views/pages/nuevaCategoria", {
    data,
    valoresForm: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const categoriasInsert = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render(__basedir + "/src/views/pages/nuevaCategoria", {
      data: req.body.id,
      valoresForm: req.body,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  let datos = req.body;
  await servicesProductos.insertCategoria(datos);
  let data = await servicesProductos.getCategorias();
  res.render(__basedir + "/src/views/pages/categorias", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const categoriasEditar = async (req, res) => {
  let id = req.query.id;
  let data = await servicesProductos.getCategoria(id);
  res.render(__basedir + "/src/views/pages/editarCategoria", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const categoriasUpdate = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render(__basedir + "/src/views/pages/editarCategoria", {
      data: req.body,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  let datos = req.body;
  await servicesProductos.updateCategoria(datos);
  let data = await servicesProductos.getCategorias();
  res.render(__basedir + "/src/views/pages/categorias", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const categoriasEliminar = async (req, res) => {
  let id = req.query.id;
  await servicesProductos.deleteCategoria(id);
  let data = await servicesProductos.getCategorias();
  res.render(__basedir + "/src/views/pages/categorias", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const precios = async (req, res) => {
  let data = await servicesProductos.getProductos();
  res.render(__basedir + "/src/views/pages/precios", {
    data,
    valoresForm: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const preciosUpdate = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    let data = await servicesProductos.getProductos();
    return res.render(__basedir + "/src/views/pages/precios", {
      data,
      valoresForm: req.body,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  let datos = req.body;
  await servicesProductos.updatePrecios(datos);
  let data = await servicesProductos.getProductos();
  res.render(__basedir + "/src/views/pages/precios", {
    data,
    valoresForm: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const local = async (req, res) => {
  let data = await servicesLocal.getLocales();
  res.render(__basedir + "/src/views/pages/local", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const localEditar = async (req, res) => {
  let id = req.query.id;
  let data = await servicesLocal.getLocal(id);
  res.render(__basedir + "/src/views/pages/editarLocal", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const localUpdate = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render(__basedir + "/src/views/pages/editarLocal", {
      data: req.body,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  let datos = req.body;
  await servicesLocal.updateLocal(datos);
  let data = await servicesLocal.getLocales();
  res.render(__basedir + "/src/views/pages/local", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const localNuevo = async (req, res) => {
  let data = await servicesProductos.lastId("locales");
  res.render(__basedir + "/src/views/pages/nuevoLocal", {
    data,
    valoresForm: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const localInsert = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render(__basedir + "/src/views/pages/nuevoLocal", {
      data: req.body.id,
      valoresForm: req.body,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  let datos = req.body;
  await servicesLocal.insertLocal(datos);
  let data = await servicesLocal.getLocales();
  res.render(__basedir + "/src/views/pages/local", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const localEliminar = async (req, res) => {
  let id = req.query.id;
  await servicesLocal.deleteLocal(id);
  let data = await servicesLocal.getLocales();
  res.render(__basedir + "/src/views/pages/local", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const fotos = async (req, res) => {
  res.render(__basedir + "/src/views/pages/fotos", {
    mostrar: "",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const fotosProductos = async (req, res) => {
  let data = await servicesProductos.getProductos();
  res.render(__basedir + "/src/views/pages/fotos", {
    data,
    mostrar: "productos",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const fotosCategorias = async (req, res) => {
  let data = await servicesProductos.getCategorias();
  res.render(__basedir + "/src/views/pages/fotos", {
    data,
    mostrar: "categorias",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const fotosLocales = async (req, res) => {
  let data = await servicesLocal.getLocales();
  res.render(__basedir + "/src/views/pages/fotos", {
    data,
    mostrar: "locales",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const fotosNueva = async (req, res) => {
  let id = req.query.id;
  let tipo = req.query.tipo;
  let data;
  switch (tipo) {
    case "productos":
      data = await servicesProductos.getProducto(id);
      res.render(__basedir + "/src/views/pages/fotos", {
        data,
        mostrar: "upload",
        tipo,
        usuario: req.session.userLog,
        userRol: req.session.userRol,
      });
      break;
    case "categorias":
      data = await servicesProductos.getCategoria(id);
      res.render(__basedir + "/src/views/pages/fotos", {
        data,
        mostrar: "upload",
        tipo,
        usuario: req.session.userLog,
        userRol: req.session.userRol,
      });
      break;
    case "locales":
      data = await servicesLocal.getLocal(id);
      res.render(__basedir + "/src/views/pages/fotos", {
        data,
        mostrar: "upload",
        tipo,
        usuario: req.session.userLog,
        userRol: req.session.userRol,
      });
      break;
  }
};

const fotosNuevaSubida = async (req, res) => {
  if (req.fileValidationError == "Error") {
    return res.render(__basedir + "/src/views/pages/fotos", {
      data: {
        nombre: req.body.nombre,
        img: req.body.nombreArchivo,
        id: req.body.id,
      },
      mostrar: "upload",
      tipo: req.query.tipo,
      errores: [{ msg: "Formato de archivo no admitido" }],
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  let data;
  let tipo = req.query.tipo;
  switch (tipo) {
    case "productos":
      data = await servicesProductos.getProductos();
      res.render(__basedir + "/src/views/pages/fotos", {
        data,
        mostrar: "productos",
        usuario: req.session.userLog,
        userRol: req.session.userRol,
      });
      break;
    case "categorias":
      data = await servicesProductos.getCategorias();
      res.render(__basedir + "/src/views/pages/fotos", {
        data,
        mostrar: "categorias",
        usuario: req.session.userLog,
        userRol: req.session.userRol,
      });
      break;
    case "locales":
      data = await servicesLocal.getLocales();
      res.render(__basedir + "/src/views/pages/fotos", {
        data,
        mostrar: "locales",
        usuario: req.session.userLog,
        userRol: req.session.userRol,
      });
      break;
  }
};

const usuarios = async (req, res) => {
  let data = await servicesUsuarios.getUsuarios();
  res.render(__basedir + "/src/views/pages/usuarios", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const usuariosNuevo = async (req, res) => {
  let locales = await servicesLocal.getLocales();
  res.render(__basedir + "/src/views/pages/nuevoUsuario", {
    locales,
    valoresForm: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const usuariosInsert = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    let locales = await servicesLocal.getLocales();
    return res.render(__basedir + "/src/views/pages/nuevoUsuario", {
      locales,
      valoresForm: req.body,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  let datos = req.body;
  datos.passHash = await hashearPassword(datos.passUser);
  await servicesUsuarios.insertUsuario(datos);
  let data = await servicesUsuarios.getUsuarios();
  res.render(__basedir + "/src/views/pages/usuarios", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const usuariosEditar = async (req, res) => {
  let usuario = req.query.id;
  let data = await servicesUsuarios.getUsuario(usuario);
  res.render(__basedir + "/src/views/pages/editarUsuario", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const usuariosUpdate = async (req, res) => {
  let datos = req.body;
  await servicesUsuarios.updateUsuario(datos);
  let data = await servicesUsuarios.getUsuarios();
  res.render(__basedir + "/src/views/pages/usuarios", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const usuariosEliminar = async (req, res) => {
  let usuario = req.query.id;
  await servicesUsuarios.deleteUsuario(usuario);
  let data = await servicesUsuarios.getUsuarios();
  res.render(__basedir + "/src/views/pages/usuarios", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const pedidos = async (req, res) => {
  let dataPedido;
  let dataMensajes;
  let idLocal = req.session.userLocal;
  if(req.query.id){
    const dataPedidoCheck = await servicesPedidos.getPedido(req.query.id);
    if(dataPedidoCheck.local === idLocal){
      dataPedido = dataPedidoCheck;
      dataMensajes = await servicesChat.getMensajes(req.query.id);
      await actividadMiddleware.actividadUser(req.session.userLog, idLocal, req.query.id, "Lectura", "");
    }
  }
  let dataPedidos = await servicesPedidos.getPedidos(idLocal);
  let dataProds = await servicesProductos.getProductos();
  let local = await servicesLocal.getLocal(idLocal);
  res.render(__basedir + "/src/views/pages/pedidos", {
    pedidoNumero: req.query.id || 0,
    dataPedido,
    dataMensajes,
    dataPedidos,
    dataProds,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    local,
  });
};

const pedidosEstado = async (req, res) => {
  await servicesPedidos.updateEstadoPedidos(req.body.id, req.body.estado);
  await actividadMiddleware.actividadUser(req.session.userLog, req.session.userLocal, req.body.id, "Estado", req.body.estado);
  res.redirect("/panel/pedidos");
};

const actividad = async(req, res) => {
  let page;
  if(isNaN(req.query.page) || req.query.page < 1){
    page = 1;
  }else{
    page = req.query.page;
  }
  let data = await servicesActividad.getActividad(req.session.userLocal, page);
  res.render(__basedir + "/src/views/pages/actividad", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const actividadToda = async(req, res) => {
  let page;
  if(isNaN(req.query.page) || req.query.page < 1){
    page = 1;
  }else{
    page = req.query.page;
  }
  let data = await servicesActividad.getActividadAll(page);
  res.render(__basedir + "/src/views/pages/actividadFull", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const stockForm = async(req, res) => {
  const data = await servicesLocal.getLocal(req.session.userLocal);
  const productos = await servicesProductos.getProductos();
  const categorias = await servicesProductos.getCategorias();
  res.render(__basedir + "/src/views/pages/stock", {
    data,
    productos,
    categorias,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const stockUpdate = async (req, res) => {
  let datos = req.body;
  let local = req.session.userLocal;
  await servicesLocal.updateStock(datos, local);
  await actividadMiddleware.actividadUser(req.session.userLog, local, 0, "Stock", datos.stock.toString());
  res.redirect("/panel/stock")
};

const pedidoProduccionLocal = async(req, res) => {
  let dataPedido;
  if(req.query.id){
    const dataPedidoCheck = await servicesProduccion.getProduccionPedido(req.query.id);
    if(dataPedidoCheck.local == req.session.userLocal){
      if(dataPedidoCheck.buzon == "mensajeFabrica"){
        await servicesProduccion.mensajeProduccionLeido(req.query.id)
      }
      dataPedido = await servicesProduccion.getProduccionPedido(req.query.id);
    }
  }
  const data = await servicesProduccion.getProduccionLocal(req.session.userLocal);
  const productos = await servicesProductosFabrica.getProductosFabrica();
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  const dataLocal = await servicesLocal.getLocal(req.session.userLocal);
  const locales = await servicesLocal.getLocales();
  const ultimosPedidos = await produccionMiddleware.getUltimosPedidos(data);
  const prodFecha = await produccionMiddleware.getFechasProduccionLocal(dataLocal.entrega, ultimosPedidos);
  res.render(__basedir + "/src/views/pages/produccion", {
    data,
    categorias,
    dataPedido,
    dataLocal,
    productos,
    prodFecha,
    locales,
    lector: "local",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    userLocal: req.session.userLocal,
  });
};

const pedidoProduccionAgregarMensajeLocal = async(req, res) => {
  // agregar mensaje a la bbdd
  const data = await servicesProduccion.getProduccionPedido(req.body.pedidoProdNum);
  let mensajes = JSON.parse(data.mensajes);
  let nuevoMensaje = [req.body.emisorMensaje, req.body.mensajeProduccion]
  mensajes.push(nuevoMensaje)
  mensajes = JSON.stringify(mensajes)
  await servicesProduccion.agregarMensajeProduccion(req.body.pedidoProdNum, mensajes, req.body.emisorMensaje)
  res.redirect(req.originalUrl);
}

const pedidoProduccionFabrica = async(req, res) => {
  let dataPedido;
  if(req.query.id){
    const dataPedidoCheck = await servicesProduccion.getProduccionPedido(req.query.id);
    if(dataPedidoCheck.buzon == "mensajeLocal"){
      await servicesProduccion.mensajeProduccionLeido(req.query.id)
    }
    dataPedido = await servicesProduccion.getProduccionPedido(req.query.id);
  }
  const locales = await servicesLocal.getLocales();
  const data = await servicesProduccion.getProduccionFabrica();
  const productos = await servicesProductosFabrica.getProductosFabrica();
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  
  // calcular estado del pedido de cada local segun fecha actual
  let fechasLocales = [];
  for await (let local of locales){
    let serviciosLocal = JSON.parse(local.servicios);
    if(serviciosLocal.pedidos){
      const data = await servicesProduccion.getProduccionLocal(local.id);
      const ultimosPedidos = await produccionMiddleware.getUltimosPedidos(data);
      let fechas = await produccionMiddleware.getFechasProduccionLocal(local.entrega, ultimosPedidos);
      fechas.localId = local.id;
      fechasLocales.push(fechas);
    }
  }
  res.render(__basedir + "/src/views/pages/produccion", {
    data,
    dataPedido,
    productos,
    categorias,
    locales,
    fechasLocales,
    lector: "fabrica",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const pedidoProduccionAgregarMensajeFabrica = async(req, res) => {
  // agregar mensaje a la bbdd
  const data = await servicesProduccion.getProduccionPedido(req.body.pedidoProdNum);
  let mensajes = JSON.parse(data.mensajes);
  let nuevoMensaje = [req.body.emisorMensaje, req.body.mensajeProduccion]
  mensajes.push(nuevoMensaje)
  mensajes = JSON.stringify(mensajes)
  await servicesProduccion.agregarMensajeProduccion(req.body.pedidoProdNum, mensajes, req.body.emisorMensaje)
  res.redirect(req.originalUrl);
}

const pedidoProduccionNuevo = async (req, res) => {
  const productos = await servicesProduccion.getProductosProduccion();
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  let ultimoPedido = await servicesProduccion.getUltimoPedido(req.session.userLocal);
  if(ultimoPedido == undefined){
    ultimoPedido = 0;
  }
  res.render(__basedir + "/src/views/pages/nuevaProduccion", {
    ultimoPedido,
    productos,
    categorias,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const pedidoProduccionInsert = async (req, res) => {
  await actividadMiddleware.actividadUser(req.session.userLog, req.session.userLocal, 0, "Nuevo Pedido a Produccion", "");
  let pedido = [];
  const productos = await servicesProduccion.getProductosProduccion();
  for(dato in req.body){
    if(!isNaN(dato)){
      if(req.body[dato] > 0){
        let pedidoItem = [];
        let producto = productos.find((datoProd) => datoProd.id == dato);
        pedidoItem.push(parseInt(req.body[dato]));
        pedidoItem.push(parseInt(dato));
        pedidoItem.push(producto.costo);
        pedido.push(pedidoItem);
      }
    }
  }
  let datos = {
    local: parseInt(req.session.userLocal),
    pedido: JSON.stringify(pedido),
    total: parseInt(req.body.pedidoProduccionImporteTotal),
    fechaDeEntrega: req.body.pedidoProduccionFechaEntrega,
  }
  await servicesProduccion.insertPedidoProduccion(datos);
  res.redirect("/panel/produccion/local");  
}

const pedidoProduccionUpdateEstado = async(req, res) => {
  await actividadMiddleware.actividadUser(req.session.userLog, req.session.userLocal, 0, "Cambio de estado de pedido", req.body.estado);
  if(req.body.estado == "cancelado"){
    await servicesProduccion.deletePedidoProduccion(req.body.id);
    if(req.body.emisor == "fabrica"){
      res.redirect("/panel/produccion/fabrica");
    } else if(req.body.emisor == "local"){
      res.redirect("/panel/produccion/local");
    }
  } else {
    await servicesProduccion.updateEstadoProduccion(req.body.estado, req.body.id);
    if(req.body.emisor == "fabrica"){
      res.redirect("/panel/produccion/fabrica?id=" + req.body.id);
    } else if(req.body.emisor == "local"){
      res.redirect("/panel/produccion/local?id=" + req.body.id);
    }
  }
}

const productosFabrica = async(req, res) => {
  let data = await servicesProductosFabrica.getProductosFabrica();
  res.render(__basedir + "/src/views/pages/productosFabrica", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const pedidoProduccionEditar = async(req, res) => {
  let productos = await servicesProductosFabrica.getProductosFabrica();
  let pedido = await servicesProduccion.getProduccionPedido(req.query.id);
  let locales = await servicesLocal.getLocales();
  res.render(__basedir + "/src/views/pages/editarPedidoProduccion", {
    locales,
    productos,
    pedido,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const pedidoProduccionUpdate = async(req, res) => {
  let pedido = [];
  const productos = await servicesProduccion.getProductosProduccion();
  for(dato in req.body){
    if(!isNaN(dato)){
      if(req.body[dato] > 0){
        let pedidoItem = [];
        let producto = productos.find((datoProd) => datoProd.id == dato);
        pedidoItem.push(parseInt(req.body[dato]));
        pedidoItem.push(parseInt(dato));
        pedidoItem.push(producto.costo);
        pedido.push(pedidoItem);
      }
    }
  }
  let datos = {
    pedido: JSON.stringify(pedido),
    total: parseInt(req.body.pedidoProduccionImporteTotal),
    local: parseInt(req.body.pedidoProduccionLocalId),
  }
  await servicesProduccion.updatePedidoProduccion(datos);
  res.redirect("/panel/produccion/fabrica?id=" + req.body.pedidoProduccionLocalId);
}

const productosFabricaNuevo = async(req, res) => {
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  const sectores = await servicesProductosFabrica.getSectoresFabrica();
  res.render(__basedir + "/src/views/pages/nuevoProductoFabrica", {
    valoresForm: {},
    categorias,
    sectores,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const productosFabricaInsert = async(req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const categorias = await servicesProductosFabrica.getCategoriasFabrica();
    const sectores = await servicesProductosFabrica.getSectoresFabrica();
    return res.render(__basedir + "/src/views/pages/nuevoProductoFabrica", {
      valoresForm: req.body,
      categorias,
      sectores,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  await servicesProductosFabrica.insertProductoFabrica(req.body);
  let data = await servicesProductosFabrica.getProductosFabrica();
  res.render(__basedir + "/src/views/pages/productosFabrica", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const productosFabricaEditar = async(req, res) => {
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  const sectores = await servicesProductosFabrica.getSectoresFabrica();
  let productoFabrica = {};
  if(req.query.id){
    productoFabrica = await servicesProductosFabrica.getProductoFabrica(req.query.id);
  }
  res.render(__basedir + "/src/views/pages/editarProductoFabrica", {
    valoresForm: productoFabrica,
    categorias,
    sectores,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const productosFabricaUpdate = async(req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const categorias = await servicesProductosFabrica.getCategoriasFabrica();
    const sectores = await servicesProductosFabrica.getSectoresFabrica();
    return res.render(__basedir + "/src/views/pages/editarProductoFabrica", {
      valoresForm: req.body,
      categorias,
      sectores,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  await servicesProductosFabrica.updateProductoFabrica(req.body, req.query.id);
  let data = await servicesProductosFabrica.getProductosFabrica();
  res.render(__basedir + "/src/views/pages/productosFabrica", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const productosFabricaEliminar = async(req, res) => {
  if(req.query.id){
    await servicesProductosFabrica.deleteProductoFabrica(req.query.id);
  }
  let data = await servicesProductosFabrica.getProductosFabrica();
  res.render(__basedir + "/src/views/pages/productosFabrica", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const categoriasFabrica = async(req, res) => {
  let data = await servicesProductosFabrica.getCategoriasFabrica();
  res.render(__basedir + "/src/views/pages/categoriasFabrica", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const categoriasFabricaNueva = async(req, res) => {
  res.render(__basedir + "/src/views/pages/nuevaCategoriaFabrica", {
    valoresForm: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const categoriasFabricaInsert = async(req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render(__basedir + "/src/views/pages/nuevaCategoriaFabrica", {
      errores: errores.array({ onlyFirstError: true }),
      valoresForm: req.body,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    })
  }
  await servicesProductosFabrica.insertCategoriaFabrica(req.body);
  let data = await servicesProductosFabrica.getCategoriasFabrica();
  res.render(__basedir + "/src/views/pages/categoriasFabrica", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const categoriasFabricaEditar = async(req, res) => {
  let categoriaFabrica = {};
  if(req.query.id){
    categoriaFabrica = await servicesProductosFabrica.getCategoriaFabrica(req.query.id);
  }
  res.render(__basedir + "/src/views/pages/editarCategoriaFabrica", {
    valoresForm: categoriaFabrica,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const categoriasFabricaUpdate = async(req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    let categoriaFabrica = {};
    if(req.query.id){
      categoriaFabrica = await servicesProductosFabrica.getCategoriaFabrica(req.query.id);
    }
    return res.render(__basedir + "/src/views/pages/editarCategoriaFabrica", {
      errores: errores.array({ onlyFirstError: true }),
      valoresForm: categoriaFabrica,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    })
  }
  if(req.query.id){
    await servicesProductosFabrica.updateCategoriaFabrica(req.body, req.query.id);
  }
  let data = await servicesProductosFabrica.getCategoriasFabrica();
  res.render(__basedir + "/src/views/pages/categoriasFabrica", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const categoriasFabricaEliminar = async(req, res) => {
  if(req.query.id){
    await servicesProductosFabrica.deleteCategoriaFabrica(req.query.id);
  }
  let data = await servicesProductosFabrica.getCategoriasFabrica();
  res.render(__basedir + "/src/views/pages/categoriasFabrica", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const fotosProductosFabrica = async(req, res) => {
  let data = await servicesProductosFabrica.getProductosFabrica();
  res.render(__basedir + "/src/views/pages/fotosProductosFabrica", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const nuevaFotoProductoFabrica = async(req, res) => {
  if(!req.query.id){
    res.redirect("/panel/productosFabrica/fotos");
  }
  const id = req.query.id
  const data = await servicesProductosFabrica.getProductoFabrica(id);
  if(data === undefined){
    res.redirect("/panel/productosFabrica/fotos");
  }
  res.render(__basedir + "/src/views/pages/nuevaFotoProductoFabrica", {
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const uploadNuevaFotoProductoFabrica = async(req, res) => {
  if (req.fileValidationError == "Error") {
    return res.render(__basedir + "/src/views/pages/nuevaFotoProductoFabrica", {
      data: {
        nombre: req.body.nombre,
        img: req.body.nombreArchivo,
        id: req.body.id,
      },
      errores: [{ msg: "Formato de archivo no admitido" }],
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  res.redirect("/panel/productosFabrica/fotos");
}

module.exports = {
  index,
  productosCard,
  productosTabla,
  productosEditar,
  productosNuevo,
  productosInsert,
  productosUpdate,
  productosEliminar,
  categoriasNueva,
  categoriasEditar,
  categoriasTabla,
  categoriasInsert,
  categoriasUpdate,
  categoriasEliminar,
  localEditar,
  localUpdate,
  localNuevo,
  localInsert,
  localEliminar,
  precios,
  preciosUpdate,
  local,
  localInsert,
  fotos,
  fotosProductos,
  fotosCategorias,
  fotosLocales,
  fotosNueva,
  fotosNuevaSubida,
  usuarios,
  usuariosNuevo,
  usuariosInsert,
  usuariosEditar,
  usuariosUpdate,
  usuariosEliminar,
  pedidos,
  pedidosEstado,
  actividad,
  actividadToda,
  stockForm,
  stockUpdate,
  pedidoProduccionLocal,
  pedidoProduccionFabrica,
  pedidoProduccionAgregarMensajeLocal,
  pedidoProduccionAgregarMensajeFabrica,
  pedidoProduccionNuevo,
  pedidoProduccionInsert,
  pedidoProduccionUpdateEstado,
  productosFabrica,
  pedidoProduccionEditar,
  pedidoProduccionUpdate,
  productosFabricaNuevo,
  productosFabricaInsert,
  productosFabricaEditar,
  productosFabricaUpdate,
  productosFabricaEliminar,
  categoriasFabrica,
  categoriasFabricaNueva,
  categoriasFabricaInsert,
  categoriasFabricaEditar,
  categoriasFabricaUpdate,
  categoriasFabricaEliminar,
  fotosProductosFabrica,
  nuevaFotoProductoFabrica,
  uploadNuevaFotoProductoFabrica,
};
