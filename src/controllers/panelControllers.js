const servicesProductos = require(__basedir + "/src/services/productos");
const servicesLocal = require(__basedir + "/src/services/local");
const servicesUsuarios = require(__basedir + "/src/services/usuarios");
const servicesPedidos = require(__basedir + "/src/services/pedidos");
const servicesChat = require(__basedir + "/src/services/chat");
const servicesActividad = require(__basedir + "/src/services/actividad");
const { validationResult } = require("express-validator");
const { hashearPassword } = require(__basedir + "/src/middlewares/hash");
const actividadMiddleware = require(__basedir + "/src/middlewares/actividad");

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
};
