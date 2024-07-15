const servicesProductos = require(__basedir + "/src/services/productos");
const servicesProductosFabrica = require(__basedir + "/src/services/productosFabrica");
const servicesLocal = require(__basedir + "/src/services/local");
const servicesUsuarios = require(__basedir + "/src/services/usuarios");
// const servicesPedidos = require(__basedir + "/src/services/pedidos");
// const servicesChat = require(__basedir + "/src/services/chat");
const servicesActividad = require(__basedir + "/src/services/actividad");
const servicesProduccion = require(__basedir + "/src/services/produccion");
const servicesReportes = require(__basedir + "/src/services/reportes");
const servicesServicios = require(__basedir + "/src/services/servicios");
const servicesFacturacion = require(__basedir + "/src/services/facturacion");
// const servicesAfip = require(__basedir + "/src/services/afip");
const servicesGastos = require(__basedir + "/src/services/gastos");
const servicesCaja = require(__basedir + "/src/services/caja");
const { validationResult } = require("express-validator");
const { hashearPassword } = require(__basedir + "/src/middlewares/hash");
const actividadMiddleware = require(__basedir + "/src/middlewares/actividad");
const produccionMiddleware = require(__basedir + "/src/middlewares/produccion");
const productosMiddleware = require(__basedir + "/src/middlewares/productos");
const reportesMiddleware = require(__basedir + "/src/middlewares/reportes");
const localMiddleware = require(__basedir + "/src/middlewares/local");
const facturacionMiddleware = require(__basedir + "/src/middlewares/facturacion");
const gastosMiddleware = require(__basedir + "/src/middlewares/gastos");
const cajaMiddleware = require(__basedir + "/src/middlewares/caja");
const erroresMiddleware = require(__basedir + "/src/middlewares/errores")


const index = async (req, res) => {
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  let errores = await erroresMiddleware.erroresGral(req.query.error);
  res.render(__basedir + "/src/views/pages/panel", {
    errores,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    servicios,
  });
};

const productosCard = async (req, res) => {
  let lista = await productosMiddleware.parseListaQuery(req.query);
  let data = await servicesProductos.getProductosLocalTodos(lista);
  let columnas = await servicesProductos.getColumnasPrecios();
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/productos", {
    data,
    errores,
    columnas,
    lista,
    vista: "card",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosTabla = async (req, res) => {
  let lista = await productosMiddleware.parseListaQuery(req.query);
  let data = await servicesProductos.getProductosLocalTodos(lista);
  let errores = await erroresMiddleware.erroresGral(req.query.error);
  let columnas = await servicesProductos.getColumnasPrecios();

  res.render(__basedir + "/src/views/pages/productos", {
    errores,
    data,
    vista: "tabla",
    lista,
    columnas,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosEditar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id)) || !req.query.lista || isNaN(parseInt(req.query.lista))){
    return res.redirect("/panel/productos/tabla?error=query1");
  }
  let data = await servicesProductos.getProductoLocal(req.query.id, req.query.lista);
  if(data === undefined){
    return res.redirect("/panel/productos/tabla?error=query2");
  }
  let dataCategorias = await servicesProductos.getCategorias();
  res.render(__basedir + "/src/views/pages/editarProducto", {
    data,
    lista: req.query.lista,
    dataCategorias,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosUpdate = async (req, res) => {
  // buscar mismo codigo de prod en uso actual y emitir error para evitar duplicados
  // si no se modifico el codigo evitar verificacion
  let codigoOriginal = await servicesProductos.getProductoLocal(req.body.id, req.body.lista);
  let buscarDuplicados = {error: false}
  if(codigoOriginal.codigo != req.body.codigo){
    let productos = await servicesProductos.getProductosLocal();
    buscarDuplicados = await productosMiddleware.buscarDuplicadosProdLocal(productos, req.body.codigo);
  }
  const errores = validationResult(req);
  if(buscarDuplicados.error){
    errores.errors.push(buscarDuplicados)
  }
  
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
  await servicesProductos.updateProductoLocal(req.body, req.body.lista);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Modificacion de Producto", `Id de pord: ${req.body.id}`)
  return res.redirect(`/panel/productos/tabla?lista=${req.body.lista}`);
};

const productosNuevo = async (req, res) => {
  let dataCategorias = await servicesProductos.getCategorias();
  let proxId = await servicesProductos.lastId("productoslocal");
  res.render(__basedir + "/src/views/pages/nuevoProducto", {
    proxId,
    dataCategorias,
    data: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const productosInsert = async (req, res) => {
  // buscar mismo codigo de prod en uso actual y emitir error para evitar duplicados
  let productos = await servicesProductos.getProductosLocal();
  let buscarDuplicados = await productosMiddleware.buscarDuplicadosProdLocal(productos, req.body.codigo);
  const errores = validationResult(req);
  if(buscarDuplicados.error){
    errores.errors.push(buscarDuplicados)
  }
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
  await servicesProductos.insertProductoLocal(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Alta de Producto", `Id de pord: ${req.body.id}`)
  return res.redirect("/panel/productos/tabla");
};

const productosEliminar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/productos/tabla?error=query1");
  }
  await servicesProductos.deleteProductoLocal(req.query.id);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Baja de Producto", `Id de pord: ${req.query.id}`);
  return res.redirect("/panel/productos/tabla");
};

const categoriasTabla = async (req, res) => {
  let data = await servicesProductos.getCategorias();
  let errores = await erroresMiddleware.erroresGral(req.query.error);
  res.render(__basedir + "/src/views/pages/categorias", {
    errores,
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
  await servicesProductos.insertCategoria(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Alta de categoria", `Id de cat: ${req.body.id}`);

  return res.redirect("/panel/categorias");
};

const categoriasEditar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/categorias?error=query1");
  }
  let data = await servicesProductos.getCategoria(req.query.id);
  if(data === undefined){
    return res.redirect("/panel/categorias?error=query2");
  }
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
  await servicesProductos.updateCategoria(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Modificacion de categoria", `Id de cat: ${req.body.id}`);
  return res.redirect("/panel/categorias");
};

const categoriasEliminar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/categorias?error=query1");
  }
  await servicesProductos.deleteCategoria(req.query.id);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Baja de categoria", `Id de cat: ${req.query.id}`);

  return res.redirect("/panel/categorias");
};

const precios = async (req, res) => {
  let lista = await productosMiddleware.parseListaQuery(req.query);
  let data = await servicesProductos.getProductosLocal(lista);
  let columnas = await servicesProductos.getColumnasPrecios();

  res.render(__basedir + "/src/views/pages/precios", {
    data,
    lista,
    columnas,
    valoresForm: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const preciosUpdate = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    let lista = await productosMiddleware.parseListaQuery(req.query);
    let data = await servicesProductos.getProductosLocal(lista);
    let columnas = await servicesProductos.getColumnasPrecios();
    return res.render(__basedir + "/src/views/pages/precios", {
      data,
      lista,
      columnas,
      valoresForm: req.body,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  
  
  let objetoPrecios = await productosMiddleware.crearObjetoUpdatePrecios(req.body);
  await servicesProductos.updatePrecios(objetoPrecios);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Modificacion de precios", "");

  return res.redirect(`/panel/precios?lista=${req.body.lista}`);
};

const local = async (req, res) => {
  let data = await servicesLocal.getLocales();
  let errores = await erroresMiddleware.erroresGral(req.query.error);
  res.render(__basedir + "/src/views/pages/local", {
    errores,
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const localEditar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/local?error=query1");
  }
  let data = await servicesLocal.getLocal(req.query.id);
  if(data === undefined){
    return res.redirect("/panel/local?error=query2");
  }
  const servicios = await servicesServicios.getServicios();
  const diasEntrega = await localMiddleware.crearObjetoDiasEntrega2(data.entrega);
  let columnas = await servicesProductos.getColumnasPrecios();

  res.render(__basedir + "/src/views/pages/editarLocal", {
    data,
    servicios,
    diasEntrega,
    columnas,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const localUpdate = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    let diasEntrega = await localMiddleware.crearObjetoDiasEntrega(req.body);
    diasEntrega = await localMiddleware.crearObjetoDiasEntrega2(diasEntrega);
    const servicios = await servicesServicios.getServicios();
    let columnas = await servicesProductos.getColumnasPrecios();
    let data = await servicesLocal.getLocal(req.query.id);
    req.body.listasdisponibles = data.listasdisponibles;

    return res.render(__basedir + "/src/views/pages/editarLocal", {
      diasEntrega,
      servicios,
      data: req.body,
      columnas,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }

  const servicios = await servicesServicios.getServicios();
  const serviciosActivos = await localMiddleware.crearObjetoServicios(servicios, req.body);
  const diasEntrega = await localMiddleware.crearObjetoDiasEntrega(req.body);
  const listas = await localMiddleware.crearListasDisponibles(req.body);
  await servicesLocal.updateLocal(req.body, serviciosActivos, diasEntrega, listas);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Modificacion de local", `Id de local: ${req.body.id}`);

  return res.redirect("/panel/local");
};

const localNuevo = async (req, res) => {
  const data = await servicesProductos.lastId("locales");
  const servicios = await servicesServicios.getServicios();
  res.render(__basedir + "/src/views/pages/nuevoLocal", {
    servicios,
    data,
    valoresForm: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const localInsert = async (req, res) => {
  const servicios = await servicesServicios.getServicios();
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render(__basedir + "/src/views/pages/nuevoLocal", {
      servicios,
      data: req.body.id,
      valoresForm: req.body,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  const diasEntrega = await localMiddleware.crearObjetoDiasEntrega(req.body)
  if(diasEntrega.length == 0){
    return res.redirect("/panel/local");
    // agregar manejo de error, un mensaje
  }
  const serviciosActivos = await localMiddleware.crearObjetoServicios(servicios, req.body) 
  await servicesLocal.insertLocal(req.body, diasEntrega, serviciosActivos);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Alta de local", `Id de local: ${req.body.id}`);
  return res.redirect("/panel/local");
};

const localEliminar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/local?error=query1");
  }
  await servicesLocal.deleteLocal(req.query.id);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Baja de local", `Id de local: ${req.query.id}`);
  return res.redirect("/panel/local");
};

const localDatosFiscales = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/local?error=query1");
  }
  const local = await servicesLocal.getLocal(req.query.id);
  if(local === undefined){
    return res.redirect("/panel/local?error=query2");
  }
  const datosFiscales = await servicesLocal.getDatosFiscales(req.query.id);
  res.render(__basedir + "/src/views/pages/editarLocalFiscal", {
    local,
    datosFiscales,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const localDatosFiscalesInsert = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const local = await servicesLocal.getLocal(req.body.local);
    const datosFiscales = await servicesLocal.getDatosFiscales(req.body.local);
    return res.render(__basedir + "/src/views/pages/editarLocalFiscal", {
      errores: errores.array({ onlyFirstError: true }),
      local,
      datosFiscales,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  await servicesLocal.insertDatosFiscales(req.body)
  return res.redirect("/panel/local");
};

const fotos = async (req, res) => {
  res.render(__basedir + "/src/views/pages/fotos", {
    mostrar: "",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const fotosProductos = async (req, res) => {
  let data = await servicesProductos.getProductosLocal();
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
  if(!req.query.id && !req.query.tipo){
    return res.redirect("/panel/fotos");
  }
  let id = req.query.id;
  let tipo = req.query.tipo;
  let data;
  switch (tipo) {
    case "productos":
      data = await servicesProductos.getProductoLocal(id);
      if(data === undefined){
        return res.redirect("/panel/fotos");
      }
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
      if(data === undefined){
        return res.redirect("/panel/fotos");
      }
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
      if(data === undefined){
        return res.redirect("/panel/fotos");
      }
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
      data = await servicesProductos.getProductosLocal();
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
  let usuarios = await servicesUsuarios.getUsuarios();
  let errores = await erroresMiddleware.erroresGral(req.query.error);
  res.render(__basedir + "/src/views/pages/usuarios", {
    errores,
    usuarios,
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
  // Capturar error si ubicacion fabrica y local !0
  if(req.body.ubicacionUser == "local" && req.body.local == 0){
    let respuesta = {
      error: true,
      msg: "Debe seleccionar un local para el usuario",
    }
    errores.errors.push(respuesta);
  }

  if(req.body.password !== ""){
    if(req.body.password !== req.body.passwordrep){
      let respuesta = {
        error: true,
        msg: "Las contraseñas no coinciden",
      }
      errores.errors.push(respuesta);
    } else {
      req.body.passHash = await hashearPassword(req.body.password);
    }
  }
  
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
  await servicesUsuarios.insertUsuario(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Alta de usuario", `Usuario creado: ${req.body.usuario}`);
  return res.redirect("/panel/usuarios");
};

const usuariosEditar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/usuarios?error=query1");
  }
  let data = await servicesUsuarios.getUsuario(req.query.id);
  if(data === undefined){
    return res.redirect("/panel/usuarios?error=query2");
  }
  let locales = await servicesLocal.getLocales();
  res.render(__basedir + "/src/views/pages/editarUsuario", {
    locales,
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const usuariosUpdate = async (req, res) => {
  const errores = validationResult(req);

  if(req.body.password !== ""){
    if(req.body.password !== req.body.passwordrep){
      let respuesta = {
        error: true,
        msg: "Las contraseñas no coinciden",
      }
      errores.errors.push(respuesta);
    } else {
      req.body.passHash = await hashearPassword(req.body.password);
    }
  }

  if (!errores.isEmpty()) {
    if(!req.query.id || isNaN(parseInt(req.query.id))){
      return res.redirect("/panel/usuarios?error=query1");
    }
    let data = await servicesUsuarios.getUsuario(req.query.id);
    if(data === undefined){
      return res.redirect("/panel/usuarios?error=query2");
    }
    let locales = await servicesLocal.getLocales();
    res.render(__basedir + "/src/views/pages/editarUsuario", {
      errores: errores.array({ onlyFirstError: true }),
      locales,
      data,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }

  await servicesUsuarios.updateUsuario(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Modificacion de usuario", `Usuario modificado: ${req.body.usuario}`);
  return res.redirect("/panel/usuarios");
};

const usuariosEliminar = async (req, res) => {
  if(!req.query.id){
    return res.redirect("/panel/usuarios?error=query1");
  }
  await servicesUsuarios.deleteUsuario(req.query.id);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Baja de usuario", `Usuario eliminado: ${req.query.id}`);

  return res.redirect("/panel/usuarios");
};

const usuariosLocal = async (req, res) => {
  const usuarios = await servicesUsuarios.getUsuariosLocal(req.session.userLocal);
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/usuariosLocal", {
    errores,
    usuarios,
    servicios,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const usuariosLocalNuevo = async (req, res) => {
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);

  res.render(__basedir + "/src/views/pages/nuevoUsuarioLocal", {
    servicios,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    userLocal: req.session.userLocal,
  });
};

const usuariosLocalInsert = async (req, res) => {
  req.body.local = req.session.userLocal;
  const errores = validationResult(req);

  if(req.body.rolUser !== ""){
    if(req.body.rolUser !== "atencion" && req.body.rolUser !== "admin"){
      let respuesta = {
        error: true,
        msg: "Rol de usuario incompatible",
      }
      errores.errors.push(respuesta);
    }
  }

  if(req.body.password !== ""){
    if(req.body.password !== req.body.passwordrep){
      let respuesta = {
        error: true,
        msg: "Las contraseñas no coinciden",
      }
      errores.errors.push(respuesta);
    } else {
      req.body.passHash = await hashearPassword(req.body.password);
    }
  }
  
  if (!errores.isEmpty()) {
    const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
    return res.render(__basedir + "/src/views/pages/nuevoUsuarioLocal", {
      servicios,
      errores: errores.array({ onlyFirstError: true }),
      usuario: req.session.userLog,
      userRol: req.session.userRol,
      userLocal: req.session.userLocal,
    });
  }

  await servicesUsuarios.insertUsuario(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Alta de usuario", `Usuario creado: ${req.body.usuario}`);
  return res.redirect("/panel/usuarios/local");
};

const usuariosLocalEliminar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/usuarios/local?error=query1");
  }
  let usuario = await servicesUsuarios.getUsuario(req.query.id);
  if(usuario === undefined){
    return res.redirect("/panel/usuarios/local?error=query2");
     // check usuario para verificar si corresponde al local
  } else if(usuario.local !== req.session.userLocal){
    return res.redirect("/panel/usuarios/local?error=query2");
  }
 
  await servicesUsuarios.deleteUsuario(req.query.id);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Baja de usuario", `Usuario eliminado: ${usuario.usuario}`);
  return res.redirect("/panel/usuarios/local");
};

const usuariosLocalEditar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/usuarios/local?error=query1");
  }
  let usuario = await servicesUsuarios.getUsuario(req.query.id);
  if(usuario === undefined){
    return res.redirect("/panel/usuarios/local?error=query2");
  // check usuario para verificar si corresponde al local
  } else if(usuario.local !== req.session.userLocal){
    return res.redirect("/panel/usuarios/local?error=query2");
  }
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);

  res.render(__basedir + "/src/views/pages/editarUsuarioLocal", {
    data: usuario,
    servicios,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const usuariosLocalUpdate = async (req, res) => {

  let usuario = await servicesUsuarios.getUsuario(req.body.id);
  if(usuario === undefined){
    return res.redirect("/panel/usuarios/local?error=query2");
  } else if(usuario.local !== req.session.userLocal){
    return res.redirect("/panel/usuarios/local?error=query2");
  }

  const errores = validationResult(req);

  if(req.body.password !== ""){
    if(req.body.password !== req.body.passwordrep){
      let respuesta = {
        error: true,
        msg: "Las contraseñas no coinciden",
      }
      errores.errors.push(respuesta);
    } else {
      req.body.passHash = await hashearPassword(req.body.password);
    }
  }

  if (!errores.isEmpty()) {
    if(!req.query.id || isNaN(parseInt(req.query.id))){
      return res.redirect("/panel/usuarios/local?error=query1");
    }
    let usuario = await servicesUsuarios.getUsuario(req.query.id);
    if(usuario === undefined){
      return res.redirect("/panel/usuarios/local?error=query2");
    } else if(usuario.local !== req.session.userLocal){
      return res.redirect("/panel/usuarios/local?error=query2");
    }
    res.render(__basedir + "/src/views/pages/editarUsuarioLocal", {
      errores: errores.array({ onlyFirstError: true }),
      data: usuario,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }

  await servicesUsuarios.updateUsuario(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Modificacion de usuario", `Usuario modificado: ${req.body.usuario}`);
  return res.redirect("/panel/usuarios/local");
};

const actividad = async(req, res) => {
  let page;
  if(isNaN(req.body.page) || req.body.page < 1){
    page = 1;
  }else{
    page = req.body.page;
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
  if(isNaN(req.body.page) || req.body.page < 1){
    page = 1;
    req.body.page = 1;
  }else{
    page = req.body.page;
  }

  let data = await servicesActividad.getActividadAll(page);
  res.render(__basedir + "/src/views/pages/actividadFull", {
    query: req.body,
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const actividadTodaFiltro = async (req, res) => {

  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    let page;
    if(isNaN(req.body.page) || req.body.page < 1){
      page = 1;
    }else{
      page = req.body.page;
    }
    let data = await servicesActividad.getActividadAll(page);
    return res.render(__basedir + "/src/views/pages/actividadFull", {
      errores: errores.array({ onlyFirstError: true }),
      query: req.body,
      data,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  
  let filtros = [];
  if(req.body.page !== ""){
    if(isNaN(parseInt(req.body.page))){
      return res.redirect("/panel/actividadToda");
    }
    // filtros.push(`page=${req.body.page}`);
  }
  if(req.body.local !== ""){
    if(isNaN(parseInt(req.body.local))){
      return res.redirect("/panel/actividadToda");
    }
    filtros.push(`local=${req.body.local}`);
  }
  if(req.body.user !== ""){
    filtros.push(`user=${req.body.user}`);
  }
  if(req.body.accion !== ""){
    filtros.push(`accion=${req.body.accion.replace(/\s/g, "_")}`);
  }

  let filtrosQuery = await actividadMiddleware.crearFiltroParaQuery(filtros);

  let page;
  if(isNaN(req.body.page) || req.body.page < 1){
    page = 1;
  }else{
    page = req.body.page;
  }

  let data = await servicesActividad.getActividadAll(page, filtrosQuery);
  res.render(__basedir + "/src/views/pages/actividadFull", {
    query: req.body,
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });

}

/* const stockForm = async(req, res) => {
  const data = await servicesLocal.getLocal(req.session.userLocal);
  const productos = await servicesProductos.getProductosLocal();
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
  let datos = req.body.stock;
  // validacion
  if(!Array.isArray(req.body.stock)){
    return res.redirect("/panel/stock")
  }
  datos.forEach((dato) => {
    if(isNaN(parseInt(dato))){
      return res.redirect("/panel/stock")}
  })
  let local = req.session.userLocal;
  await servicesLocal.updateStock(datos, local);
  await actividadMiddleware.actividadUser(req.session.userLog, local, 0, "Stock", datos.toString());
  return res.redirect("/panel/stock")
}; */

const pedidoProduccionLocal = async(req, res) => {
  let lista = await productosMiddleware.parseListaQuery(req.query);
  console.log("ping" + lista)
  const productos = await servicesProductosFabrica.getProductosFabricaHistoricos(lista);
  let categoriasHistoricas = [];
  let dataPedido;
  if(req.query.id){
    if(isNaN(parseInt(req.query.id))){
      return res.redirect("/panel/produccion/Local?error=query1")
    }
    const dataPedidoCheck = await servicesProduccion.getProduccionPedido(req.query.id);
    if(dataPedidoCheck.local == "x"){
      return res.redirect("/panel/produccion/Local?error=query1")
    }
    if(dataPedidoCheck.local == req.session.userLocal){
      if(dataPedidoCheck.buzon == "mensajeFabrica"){
        await servicesProduccion.mensajeProduccionLeido(req.query.id)
      }
      dataPedido = await servicesProduccion.getProduccionPedido(req.query.id);
      categoriasHistoricas = await produccionMiddleware.getCategoriasDeProductos(dataPedido.pedido, productos);
    }
  }
  const data = await servicesProduccion.getProduccionLocal(req.session.userLocal);
  const dataLocal = await servicesLocal.getLocal(req.session.userLocal);
  const locales = await servicesLocal.getLocalesHistoricos();
  const prodFecha = await produccionMiddleware.getFechasProduccionLocal(dataLocal.entrega, data);
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/produccion", {
    errores,
    data,
    categoriasHistoricas,
    dataPedido,
    dataLocal,
    productos,
    prodFecha,
    locales,
    lector: "local",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    userLocal: req.session.userLocal,
    servicios,
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
  return res.redirect(req.originalUrl);
}

const pedidoProduccionLocalTabla = async(req, res) => {
  const produccion = await servicesProduccion.getProduccionLocal(req.session.userLocal);
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  const filtrosDisponibles = ["inbox", "cargados", "aceptados"];
  let filtros = await produccionMiddleware.parseFiltrosTablaProduccion(req.query.filtro, filtrosDisponibles);

  res.render(__basedir + "/src/views/pages/tablaProduccionLocal", {
    produccion,
    servicios,
    filtros,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const pedidoProduccionFabrica = async(req, res) => {
  const productos = await servicesProductosFabrica.getProductosFabricaHistoricos();
  let categoriasHistoricas = [];
  let dataPedido;
  if(req.query.id){
    if(isNaN(parseInt(req.query.id))){
      return res.redirect("/panel/produccion/fabrica?error=query1");
    }
    dataPedido = await servicesProduccion.getProduccionPedido(req.query.id);
    if(dataPedido.local === "x"){
      return res.redirect("/panel/produccion/fabrica?error=query2")
    }
    if(dataPedido.buzon == "mensajeLocal"){
      await servicesProduccion.mensajeProduccionLeido(req.query.id)
    }
    categoriasHistoricas = await produccionMiddleware.getCategoriasDeProductos(dataPedido.pedido, productos);
  }
  const locales = await servicesLocal.getLocalesHistoricos();
  const data = await servicesProduccion.getProduccionFabrica();
  
  // calcular estado del pedido de cada local segun fecha actual
  let fechasLocales = [];
  for await (let local of locales){
    let serviciosLocal = JSON.parse(local.servicios);
    if(serviciosLocal.pedidos){
      const data = await servicesProduccion.getProduccionLocal(local.id);
      let fechas = await produccionMiddleware.getFechasProduccionLocal(local.entrega, data);
      fechas.localId = local.id;
      fechasLocales.push(fechas);
    }
  }

  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/produccion", {
    errores,
    data,
    dataPedido,
    productos,
    categoriasHistoricas,
    locales,
    fechasLocales,
    lector: "fabrica",
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
};

const pedidoProduccionFabricaTabla = async(req, res) => {
  const locales = await servicesLocal.getLocalesHistoricos();
  const produccion = await servicesProduccion.getProduccionFabrica();
  const filtrosDisponibles = ["inbox", "cargados", "aceptados"];
  let filtros = await produccionMiddleware.parseFiltrosTablaProduccion(req.query.filtro, filtrosDisponibles);
  
  res.render(__basedir + "/src/views/pages/tablaProduccion", {
    produccion,
    locales,
    filtros,
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
  return res.redirect(req.originalUrl);
}

const pedidoProduccionNuevo = async (req, res) => {
  // verificar si el pedido ya está tomado antes de abrir
  const data = await servicesProduccion.getProduccionLocal(req.session.userLocal);
  const dataLocal = await servicesLocal.getLocal(req.session.userLocal);
  const prodFecha = await produccionMiddleware.getFechasProduccionLocal(dataLocal.entrega, data);
  if(prodFecha.pedidoEstado !== "abierto" && prodFecha.proximoPedidoEstado !== "abierto" && prodFecha.pedidoEstado !== "demorado" && prodFecha.proximoPedidoEstado !== "demorado"){
    return res.redirect("/panel/produccion/local")
  }
  const local = await servicesLocal.getLocal(req.session.userLocal);
  const productos = await servicesProduccion.getProductosProduccion(local.listacostosprimaria);
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  let ultimoPedido = await servicesProduccion.getUltimoPedido(req.session.userLocal);
  if(ultimoPedido == undefined){
    ultimoPedido = 0;
  }
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  res.render(__basedir + "/src/views/pages/nuevaProduccion", {
    ultimoPedido,
    productos,
    categorias,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    servicios,
  })
}

const pedidoProduccionInsert = async (req, res) => {
/*   await actividadMiddleware.actividadUser(req.session.userLog, req.session.userLocal, 0, "Nuevo Pedido a Produccion", "");
 */
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

  // manejo temporal de error
  if(isNaN(parseInt(req.body.pedidoProduccionImporteTotal))){
    return res.redirect("/panel/produccion/local");
  }

  let datos = {
    local: parseInt(req.session.userLocal),
    pedido: JSON.stringify(pedido),
    total: parseInt(req.body.pedidoProduccionImporteTotal),
    fechaDeEntrega: req.body.pedidoProduccionFechaEntrega,
  }
  let proxId = await servicesProductos.lastId("produccion");
  await servicesProduccion.insertPedidoProduccion(datos);
  await servicesActividad.insertActividad(req.session.userLocal, proxId, req.session.userLog, "Alta de pedido a produccion", `Id de pedido: ${proxId}`);

  return res.redirect("/panel/produccion/local");  
}

const pedidoProduccionUpdateEstado = async(req, res) => {
/*   await actividadMiddleware.actividadUser(req.session.userLog, req.session.userLocal, 0, "Cambio de estado de pedido", req.body.estado);
 */if(req.body.estado == "cancelado"){
    await servicesProduccion.deletePedidoProduccion(req.body.id);
    await servicesActividad.insertActividad(req.session.userLocal, req.body.id, req.session.userLog, "Baja de pedido a produccion", `Id de pedido: ${req.body.id}`);
    if(req.body.emisor == "fabrica"){
      return res.redirect("/panel/produccion/fabrica");
    } else if(req.body.emisor == "local"){
      return res.redirect("/panel/produccion/local");
    }
  } else if(req.body.estado == "entregado" && req.session.userLocal == 0){
    await servicesProduccion.updateEstadoProduccion(req.body.estado, req.body.id);
    await servicesActividad.insertActividad(req.session.userLocal, req.body.id, req.session.userLog, "Modificacion de pedido a produccion", `Nuevo estado: ${req.body.estado}`);
    return res.redirect("/panel/produccion/fabrica");
  } else if(req.body.emisor == "fabrica" && req.session.userLocal == 0){
    await servicesProduccion.updateEstadoProduccion(req.body.estado, req.body.id);
    await servicesActividad.insertActividad(req.session.userLocal, req.body.id, req.session.userLog, "Modificacion de pedido a produccion", `Nuevo estado: ${req.body.estado}`);
    return res.redirect("/panel/produccion/fabrica?id=" + req.body.id);
  } else {
    return res.redirect("/panel");
  }
}

const pedidoProduccionEditar = async(req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/produccion/fabrica?error=query1");
  }
  let pedido = await servicesProduccion.getProduccionPedido(req.query.id);
  if(pedido === undefined){
    return res.redirect("/panel/produccion/fabrica?error=query2");
  }
  if(req.session.userRol == "admin" && pedido.estado !== "personalizado"){
    return res.redirect("/panel/produccion/fabrica?error=produccion1");
  }
  let productos = await servicesProductosFabrica.getProductosFabricaActivos();
  let locales = await servicesLocal.getLocalesHistoricos();
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  return res.render(__basedir + "/src/views/pages/editarPedidoProduccion", {
    locales,
    productos,
    pedido,
    categorias,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    servicios,
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
  // ticket 004
  // manejo de error temporal
  if(isNaN(parseInt(req.body.pedidoProduccionImporteTotal))){
    return res.redirect("/panel/produccion/local?id=" + req.body.pedidoProduccionLocalId);
  }

  let datos = {
    pedido: JSON.stringify(pedido),
    total: parseInt(req.body.pedidoProduccionImporteTotal),
    local: parseInt(req.body.pedidoProduccionLocalId),
  }
  await servicesProduccion.updatePedidoProduccion(datos);
  await servicesActividad.insertActividad(req.session.userLocal, req.body.pedidoProduccionLocalId, req.session.userLog, "Modificacion de pedido a produccion", "Actualizacion de pedido");

  if(req.session.userRol == "admin"){
    return res.redirect("/panel/produccion/local?id=" + req.body.pedidoProduccionLocalId);
  }
  return res.redirect("/panel/produccion/fabrica?id=" + req.body.pedidoProduccionLocalId);
}

const pedidoProduccionPersonalizadoNuevo = async (req, res) => {
  const locales = await servicesLocal.getLocalesHistoricos();
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/nuevoPedidoPersonalizado", {
    errores,
    locales,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const pedidoProduccionPersonalizadoCrear = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.redirect("/panel/produccion/personalizado/nuevo?error=validacion1")
  }
  let data = {};
  data.fecha = await produccionMiddleware.fechaProduccionNormalizada(req.body.fecha);
  data.local = req.body.local;
  data.minimos = req.body.minimos || "false";
  let proxId = await servicesProductos.lastId("produccion");
  await servicesProduccion.insertPedidoProduccionPersonalizado(data);
  await servicesActividad.insertActividad(req.session.userLocal, proxId, req.session.userLog, "Alta de pedido personalizado", "");

  res.redirect("/panel/produccion/fabrica");
}

const productosFabrica = async(req, res) => {
  let lista = await productosMiddleware.parseListaQuery(req.query);
  let data = await servicesProductosFabrica.getProductosFabrica(lista);
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/productosFabrica", {
    errores,
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
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
  let productos = await servicesProductosFabrica.getProductosFabrica();
  let buscarDuplicados = await productosMiddleware.buscarDuplicadosProdFabrica(productos, req.body.codigo);
  const errores = validationResult(req);
  if(buscarDuplicados.error){
    errores.errors.push(buscarDuplicados)
  }

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
  let proxId = await servicesProductos.lastId("productosfabrica");
  await servicesProductosFabrica.insertProductoFabrica(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Alta de producto fabrica", `Id de prod: ${proxId}`);
  return res.redirect("/panel/productosFabrica");
}

const productosFabricaEditar = async(req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/productosFabrica?error=query1");
  }
  let productoFabrica = await servicesProductosFabrica.getProductoFabrica(req.query.id);
  if(productoFabrica == undefined){
    return res.redirect("/panel/productosFabrica?error=query2");
  }
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  const sectores = await servicesProductosFabrica.getSectoresFabrica();
  res.render(__basedir + "/src/views/pages/editarProductoFabrica", {
    valoresForm: productoFabrica,
    categorias,
    sectores,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const productosFabricaUpdate = async(req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/productosFabrica?error=query1")
  }
  // buscar mismo codigo de prod en uso actual y emitir error para evitar duplicados
  let codigoOriginal = await servicesProductosFabrica.getProductoFabrica(req.query.id);
  if(codigoOriginal === undefined){
    return res.redirect("/panel/productosFabrica?error=query1")
  }
  let buscarDuplicados = {error: false}
  if(codigoOriginal.codigo != req.body.codigo){
    let productos = await servicesProductosFabrica.getProductosFabrica();
    buscarDuplicados = await productosMiddleware.buscarDuplicadosProdFabrica(productos, req.body.codigo);
  }
  const errores = validationResult(req);
  if(buscarDuplicados.error){
    errores.errors.push(buscarDuplicados)
  }

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
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Modificacion de producto fabrica", `Id de prod: ${req.query.id}`);
  return res.redirect("/panel/productosFabrica");
}

const productosFabricaEliminar = async(req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/productosFabrica?error=query1")
  }
  await servicesProductosFabrica.deleteProductoFabrica(req.query.id);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Baja de producto fabrica", `Id de prod: ${req.query.id}`);
  return res.redirect("/panel/productosFabrica");
}

const categoriasFabrica = async(req, res) => {
  let data = await servicesProductosFabrica.getCategoriasFabrica();
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/categoriasFabrica", {
    errores,
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
  let proxId = await servicesProductos.lastId("categoriasfabrica");
  await servicesProductosFabrica.insertCategoriaFabrica(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Alta de categoria fabrica", `Id de cat: ${proxId}`);
  return res.redirect("/panel/categoriasFabrica");
}

const categoriasFabricaEditar = async(req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/categoriasFabrica?error=query1")
  }
  let categoriaFabrica = await servicesProductosFabrica.getCategoriaFabrica(req.query.id);
  if(categoriaFabrica === undefined){
    return res.redirect("/panel/categoriasFabrica?error=query2")
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
    if(!req.query.id){
      return res.redirect("/panel/categoriasFabrica?error=query1")
    }
    let categoriaFabrica = await servicesProductosFabrica.getCategoriaFabrica(req.query.id);
    if(categoriaFabrica === undefined){
      return res.redirect("/panel/categoriasFabrica?error=query2")
    }
    return res.render(__basedir + "/src/views/pages/editarCategoriaFabrica", {
      errores: errores.array({ onlyFirstError: true }),
      valoresForm: categoriaFabrica,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    })
  }
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/categoriasFabrica?error=query1")
  }
  await servicesProductosFabrica.updateCategoriaFabrica(req.body, req.query.id);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Modificacion de categoria fabrica", `Id de cat: ${req.query.id}`);
  return res.redirect("/panel/categoriasFabrica");
}

const categoriasFabricaEliminar = async(req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/categoriasFabrica?error=query1")
  }
  await servicesProductosFabrica.deleteCategoriaFabrica(req.query.id);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Baja de categoria fabrica", `Id de cat: ${req.query.id}`);
  return res.redirect("/panel/categoriasFabrica");
}

const fotosProductosFabrica = async(req, res) => {
  let data = await servicesProductosFabrica.getProductosFabrica();
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/fotosProductosFabrica", {
    errores,
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const nuevaFotoProductoFabrica = async(req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/productosFabrica/fotos?error=query1");
  }
  const data = await servicesProductosFabrica.getProductoFabrica(req.query.id);
  if(data === undefined){
    return res.redirect("/panel/productosFabrica/fotos?error=query2");
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
  return res.redirect("/panel/productosFabrica/fotos");
}

const reportes = async (req, res) => {
  const sectores = await servicesProductosFabrica.getSectoresFabrica();
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/reportesProduccion", {
    errores,
    sectores,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const reportesSelector = async(req, res) => {
  res.redirect(`/panel/produccion/reportes/${req.body.tipo}?sector=${req.body.sector}&fecha=${req.body.fecha}`);
}

const reportePlanta = async(req, res) => {
  //verificar querys
  if(req.query.fecha === undefined || req.query.sector === undefined){
    return res.redirect("/panel/produccion/reportes?error=query2");
  }
  //verificar validez del sector
  const sectores = await servicesProductosFabrica.getSectoresFabrica();
  if(sectores.find((dato) => dato.sector == req.query.sector) === undefined){
    return res.redirect("/panel/produccion/reportes?error=query2");
  }
  const fecha = await produccionMiddleware.fechaProduccionNormalizada(req.query.fecha);
  const pedidos = await servicesReportes.getReportes(fecha);
  // Verifica si la fecha contiene pedidos
  if(pedidos.length == 0){
    return res.redirect("/panel/produccion/reportes?error=reporte1");
  }
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  const productos = await servicesProductosFabrica.getProductosFabricaHistoricos();
  const data = await reportesMiddleware.reportePlanta(productos, pedidos, req.query.sector);
  const productosDelPedido = await reportesMiddleware.productosDelPedido(productos, data);
  const categoriasReportePlanta = await servicesReportes.getCategoriasReporte();
  res.render(__basedir + "/src/views/pages/reportePlanta", {
    sector: req.query.sector,
    fecha,
    data,
    categorias,
    categoriasReportePlanta,
    productos: productosDelPedido,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const reportePlantaCategoriasEliminar = async(req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/produccion/reportes/categorias?error=query1")
  }
  await servicesReportes.deleteCategoriasReporte(req.query.id);
  return res.redirect("/panel/produccion/reportes/categorias");
}

const reportePedidos = async(req, res) => {
  //verificar querys
  if(req.query.fecha === undefined || req.query.sector === undefined){
    return res.redirect("/panel/produccion/reportes?error=query1");
  }
  //verificar validez del sector
  const sectores = await servicesProductosFabrica.getSectoresFabrica();
  if(sectores.find((dato) => dato.sector == req.query.sector) === undefined){
    return res.redirect("/panel/produccion/reportes?error=query2");
  }
  const fecha = await produccionMiddleware.fechaProduccionNormalizada(req.query.fecha);
  const pedidos = await servicesReportes.getReportes(fecha);
  // Verifica si la fecha contiene pedidos
  if(pedidos.length == 0){
    return res.redirect("/panel/produccion/reportes?error=reporte1");
  }
  const locales = await servicesLocal.getLocalesHistoricos();
  const pedidosFiltrados = await reportesMiddleware.sumarPedidosMismaFecha(pedidos, locales);
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  const productos = await servicesProductosFabrica.getProductosFabricaHistoricos(); 
  res.render(__basedir + "/src/views/pages/reportePedidos", {
    sector: req.query.sector,
    fecha,
    pedidos: pedidosFiltrados,
    categorias,
    productos,
    locales,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const reporteValorizado = async(req, res) => {
  //verificar querys
  if(req.query.fecha === undefined || req.query.sector === undefined){
    return res.redirect("/panel/produccion/reportes?error=query1");
  }
  //verificar validez del sector
  const sectores = await servicesProductosFabrica.getSectoresFabrica();
  if(sectores.find((dato) => dato.sector == req.query.sector) === undefined){
    return res.redirect("/panel/produccion/reportes?error=query2");
  }
  const fecha = await produccionMiddleware.fechaProduccionNormalizada(req.query.fecha);
  const pedidos = await servicesReportes.getReportes(fecha);
  // Verifica si la fecha contiene pedidos
  if(pedidos.length == 0){
    return res.redirect("/panel/produccion/reportes?error=reporte1");
  }
  const locales = await servicesLocal.getLocalesHistoricos();
  const pedidosFiltrados = await reportesMiddleware.sumarPedidosMismaFecha(pedidos, locales);
  const localesConPedido = await reportesMiddleware.localesConPedido(pedidosFiltrados);
  // const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  const productos = await servicesProductosFabrica.getProductosFabricaHistoricos();
  const categorias = await produccionMiddleware.getCategoriasDeProductosArray(pedidosFiltrados, productos, req.query.sector);
  const cantidadesPorProducto = await reportesMiddleware.cantidadesPorProducto(productos, pedidosFiltrados, req.query.sector);
  res.render(__basedir + "/src/views/pages/reporteValorizado", {
    sector: req.query.sector,
    fecha,
    pedidos: pedidosFiltrados,
    categorias,
    productos,
    locales,
    localesConPedido,
    cantidadesPorProducto,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const reportePlantaCategorias = async (req, res) => {
  const categorias = await servicesReportes.getCategoriasReporte();
  const productosFabrica = await servicesProductosFabrica.getProductosFabricaActivos();
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/reportePlantaCategorias", {
    errores,
    categorias,
    productosFabrica,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const reportePlantaCategoriasNueva = async (req, res) => {
  const productosFabrica = await servicesProductosFabrica.getProductosFabricaActivos();
  res.render(__basedir + "/src/views/pages/nuevaCategoriaReportePlanta", {
    valoresForm: {},
    productosFabrica,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const reportePlantaCategoriasEditar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/produccion/reportes/categorias/");
  }
  const categoria = await servicesReportes.getCategoriaReporte(parseInt(req.query.id));
  if(categoria.length !== 1){
    return res.redirect("/panel/produccion/reportes/categorias/");
  }
  const productosFabrica = await servicesProductosFabrica.getProductosFabricaActivos();
  res.render(__basedir + "/src/views/pages/editorCategoriaReportePlanta", {
    valoresForm: categoria[0],
    productosFabrica,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const reportePlantaCategoriasInsert = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const productosFabrica = await servicesProductosFabrica.getProductosFabricaActivos();
    return res.render(__basedir + "/src/views/pages/nuevaCategoriaReportePlanta", {
      errores: errores.array({ onlyFirstError: true }),
      valoresForm: req.body,
      productosFabrica,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    })
  };

  await servicesReportes.insertCategoriasReporte(req.body)
  return res.redirect("/panel/produccion/reportes/categorias");
}

const reportePlantaCategoriasUpdate = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const productosFabrica = await servicesProductosFabrica.getProductosFabricaActivos();
    return res.render(__basedir + "/src/views/pages/editorCategoriaReportePlanta", {
      errores: errores.array({ onlyFirstError: true }),
      valoresForm: req.body,
      productosFabrica,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    })
  };
  
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/produccion/reportes/categorias/");
  }
  req.body.id = req.query.id
  await servicesReportes.updateCategoriasReporte(req.body)
  return res.redirect("/panel/produccion/reportes/categorias");
}

const servicios = async (req, res) => {
  let data = await servicesServicios.getServicios();
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/servicios", {
    errores,
    data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const servicioNuevo = async (req, res) => {
  let data = await servicesProductos.lastId("servicios");
  res.render(__basedir + "/src/views/pages/nuevoServicio", {
    data,
    valoresForm: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const servicioInsert = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render(__basedir + "/src/views/pages/nuevoServicio", {
      errores: errores.array({ onlyFirstError: true }),
      valoresForm: req.body,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    })
  }
  await servicesServicios.insertServicio(req.body);
  return res.redirect("/panel/servicios");
}

const servicioEliminar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/servicios?error=query1");
  }
  await servicesServicios.deleteServicio(req.query.id);
  return res.redirect("/panel/servicios");
};

const preciosProductosFabrica = async(req, res) => {
  let lista = await productosMiddleware.parseListaQuery(req.query);
  const categorias = await servicesProductosFabrica.getCategoriasFabrica();
  const productos = await servicesProductosFabrica.getProductosFabrica(lista);
  res.render(__basedir + "/src/views/pages/preciosFabrica", {
    categorias,
    productos,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  });
}

const preciosProductosFabricaUpdate = async(req, res) => {
  await servicesProductosFabrica.updatePreciosProductosFabrica(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Modificacion precios de productos de fabrica", "");
  res.redirect("/panel/productosFabrica/precios");
}

const facturacion = async(req, res) => {
  if(req.session.userLocal == 0){
    return res.redirect("/panel");
  }
  const local = await servicesLocal.getLocal(req.session.userLocal);
  const serviciosLocal = JSON.parse(local.servicios);
  if(!serviciosLocal.facturacion){
    return res.redirect("/panel?error=acceso1");
  }
  // Verificar que esté la caja abierta para facturar
  const registrosDeCaja = await servicesCaja.getCierres(req.session.userLocal);
  const estadoDeCaja = await cajaMiddleware.estadoDeCaja(registrosDeCaja);
  if(estadoDeCaja.error){
    return res.redirect(`/panel?error=${estadoDeCaja.errorCode}`);
  }

  let data = false;
  // Si se carga el id de la seña debe especificar la lista de precios -- Ticket
  if(req.query.id){
    if(isNaN(parseInt(req.query.id))){
      return res.redirect("/panel/facturacion?error=query1");
    }
    let senia = await servicesFacturacion.getSenia(req.session.userLocal, req.query.id);
    if(senia !== undefined){
      data = senia;
    } else {
      return res.redirect("/panel/facturacion?error=query2");
    }
  }
  // checkear datos fiscales para habilitar facturacion
  const datosFiscales = await servicesLocal.getDatosFiscales(req.session.userLocal);
  if(datosFiscales == undefined){
    return res.redirect("/panel?error=datosFiscales1")
  }

  let lista = local.listaprimaria;
  if(req.query.lista && !isNaN(parseInt(req.query.lista))){
    lista = `lista${req.query.lista}`;
    // verificar si la lista solicitada está habilitada en la bbdd -- Ticket
    let listasDisponibles = JSON.parse(local.listasdisponibles);
    let checkLista = listasDisponibles.findIndex((item) => item == lista);
    if(checkLista < 0){
      return res.redirect("/panel?error=lista1")
    }
  }
  
  const productos = await servicesProductos.getProductosLocal(lista);
  const categorias = await servicesProductos.getCategorias();
  const botonesfacturacion = await servicesFacturacion.getBotonesFacturacion();
  const botonesPersonalizados = await servicesProductos.getProductosPersonalizadosxLocal(req.session.userLocal)
  let columnas = await servicesProductos.getColumnasPrecios();

  res.render(__basedir + "/src/views/pages/facturacion", {
    productos,
    categorias,
    data,
    datosFiscales,
    local,
    columnas,
    lista,
    impuestos: datosFiscales.condicioniva,
    botonesfacturacion,
    botonesPersonalizados,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    layout: __basedir + "/src/views/layouts/facturacion",
  })
}

const facturacionPost = async(req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    let msgError = [];
    errores.errors.forEach((error) => {
      msgError.push(error.msg)
    })
    msgError = msgError.join("<br>")
    return res.send({error: JSON.stringify(msgError), resultado: false, imprimir: false});
  }
  
  // verificar estado de caja previo registro
  const registrosDeCaja = await servicesCaja.getCierres(req.session.userLocal);
  const estadoDeCaja = await cajaMiddleware.estadoDeCaja(registrosDeCaja);
  if(estadoDeCaja.error){
    return res.send({error: "Caja cerrada, abra un nueva caja para operar", resultado: false, imprimir: false});
  }
  // modlocal
  const local = await servicesLocal.getLocal(req.session.userLocal);
  const datosFiscales = await servicesLocal.getDatosFiscales(req.session.userLocal);
  // verifica estado del servidor si es Fact con CAE
  if(req.body.tipo !== "X" && req.body.tipo !== "S"){
    const estadoDeServidor = await facturacionMiddleware.checkServerWSFE(local.testing);
    if(estadoDeServidor.data.error == true){
      return res.send({error: estadoDeServidor.data.msg, resultado: false, imprimir: false});
    }
  }
  
  let fecha = await facturacionMiddleware.fechaHoy();
  fecha = await facturacionMiddleware.fechaHyphen(fecha);
  req.body.fecha = fecha;
  let pago = 0;
  if(!isNaN(parseFloat(req.body.pago))){
    pago = parseFloat(req.body.pago);
  }
  // Validar montos - apoyo front end
  // verificar monto del pago
  if(req.body.tipo !== "S"){
    if(parseFloat(req.body.vuelto) < 0 && pago > 0){
      return res.send({error: "El monto abonado no cubre el total de la factura", resultado: false, imprimir: false});
      } 
  }
  // Si el pago es multiple el monto no puede generar vuelto
  if(req.body.formaDePago === "multiple"){
    if(parseFloat(req.body.vuelto) > 0){
      return res.send({error: "El monto total abonado en pagos multiples no puede ser mayor al monto del ticket", resultado: false, imprimir: false});
      } else if(parseFloat(req.body.vuelto) < 0){
        return res.send({error: "El monto abonado no cubre el total de la factura", resultado: false, imprimir: false});
      }
  }
  // verificar que solo "efectivo" en pago multiple exceda el valor de la operacion, y que no haya montos negativos
  if(req.body.pagoMultiple !== ""){
    let pagoMultiple = JSON.parse(req.body.pagoMultiple)
    let total = parseFloat(req.body.total)
    if(pagoMultiple.montocredito > total || pagoMultiple.montodebito > total || pagoMultiple.montovirtual > total){
      return res.send({error: "El monto total abonado en pagos multiples no puede ser mayor al monto del ticket", resultado: false, imprimir: false});
  
    }
    if(pagoMultiple.montoefectivo < 0 || pagoMultiple.montodebito < 0 || pagoMultiple.montocredito < 0 || pagoMultiple.montovirtual < 0){
      return res.send({error: "El monto abonado no puede ser negativo", resultado: false, imprimir: false});
    }
  }

  // if(req.body.tipo == "X" || req.body.tipo == "S"  || (req.body.tipo == "NC" && req.body.nc == "X")){
  if(req.body.tipo == "X" || req.body.tipo == "S"){
    let numeracion = await servicesFacturacion.getFacturasNF(local.id, req.body.tipo);
    numeracion = numeracion.length + 1;
    // modlocal - solicita CUIT el servicio
    let respQuery = await servicesFacturacion.insertFacturaNF(local, req.body, numeracion, datosFiscales);
    if(req.body.imprimir == "true" && req.body.tipo !== "S"){
      return res.send({error: "", resultado: true, imprimir: true, tipo: "x", numero: respQuery});
    } else if(req.body.tipo == "S"){
      return res.send({error: "", resultado: true, imprimir: true, tipo: "s", numero: respQuery});
    }
    return res.send({error: "", resultado: true, imprimir: false, tipo: "x", numero: respQuery});
  } else {
    // modlocal - solicita CUIT y ptoventa el servicio
    let datos = await facturacionMiddleware.crearReqAPIWSFE(req.body, local, datosFiscales);
    // enviar req a AFIP
    let CAE = await new Promise((res) => res(facturacionMiddleware.fetchAPIWSFE(datos)));
    let orden;
    if(CAE.error){
      console.log("Error detectado en CAE" + CAE.error);
      return res.send({error: CAE.error, resultado: false, imprimir: false, tipo: "CAE"});
    } else {
      orden = await servicesFacturacion.insertFacturaConCAE(CAE, datos, req.body);
    }
    if(req.body.imprimir == "false"){
      return res.send({error: "", resultado: true, imprimir: false, tipo: "CAE", numero: orden});
    } else {
      return res.send({error: "", resultado: true, imprimir: true, tipo: "CAE", numero: orden});
    }
  }
}

const facturacionNC = async(req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.send({error: "ID de factura incorrecto", resultado: false});
  }
  if(!req.query.tipo || (req.query.tipo !== "X" && req.query.tipo !== "A" && req.query.tipo !== "B" && req.query.tipo !== "C")){
    return res.send({error: "Tipo de factura invalido", resultado: false});
  }

  // verificar estado de caja previo registro
  const registrosDeCaja = await servicesCaja.getCierres(req.session.userLocal);
  const estadoDeCaja = await cajaMiddleware.estadoDeCaja(registrosDeCaja);
  if(estadoDeCaja.error){
    return res.send({error: "Caja cerrada, abra un nueva caja para operar", resultado: false, imprimir: false});
  }
  // Get local
  // modlocal
  const local = await servicesLocal.getLocal(req.session.userLocal);
  const datosFiscales = await servicesLocal.getDatosFiscales(req.session.userLocal);

  // verifica estado del servidor si es Fact con CAE
  if(req.body.tipo !== "X"){
    const estadoDeServidor = await facturacionMiddleware.checkServerWSFE(local.testing);
    if(estadoDeServidor.data.error == true){
      return res.send({error: estadoDeServidor.data.msg, resultado: false, imprimir: false});
    }
  }
  
  // verificar que la factura no tenga NC previa
  let notasPrevias;
  let factura;
  if(req.query.tipo == "X"){
    notasPrevias = await servicesFacturacion.getFacturasNF(req.session.userLocal, "NC");
    factura = await servicesFacturacion.getFacturaNF(req.query.id, req.session.userLocal);
    if(factura.length === 0){
      return res.send({error: "Factura inexistente", resultado: false});
    }
  } else {
    let tipo;
    switch (req.query.tipo) {
      case "A":
        tipo = 3;
        break;
      case "B":
        tipo = 8;
        break;
      case "C":
        tipo = 13;
        break;
      default:
        break;
    }
    notasPrevias = await servicesFacturacion.getFacturasCAE(req.session.userLocal, tipo);
    factura = await servicesFacturacion.getFacturaCAE(req.query.id, req.session.userLocal);
    if(factura.length === 0){
      return res.send({error: "Factura inexistente", resultado: false});
    }
  }
  let NCPrevia = notasPrevias.filter((nota) => JSON.parse(nota.observaciones).nc == factura[0].numero);
  if(NCPrevia.length > 0){
    return res.send({error: "Nota de crédito existente", info: NCPrevia[0].numero, resultado: false});
  }
  // return res.send({notasPrevias, factura})
  // solicitar nc
  // Get fecha
  let fechaCbte = factura[0].fecha;
  let fecha = await facturacionMiddleware.fechaHoy();
  fecha = await facturacionMiddleware.fechaHyphen(fecha)
  factura[0].fecha = fecha;
  // Desestructura
  factura = await facturacionMiddleware.ajustarObjParaNC(factura)
  if(factura.tipo === "X"){
    // Get numeracion
    let numeracion = await servicesFacturacion.getFacturasNF(local.id, "NC");
    numeracion = numeracion.length + 1;
    // Agregar info de NC
    factura.tipo = "NC";
    // Registrar NC en facturacionNF
    // modlocal - solicita CUIT el servicio
    let respQuery = await servicesFacturacion.insertFacturaNF(local, factura, numeracion, datosFiscales);
    return res.send({error: false, info: respQuery, resultado: true});
  } else if(factura.tipo === 1 || factura.tipo === 6 || factura.tipo === 11){
    // modlocal - solicita CUIT y ptoventa el middleware
    let datos = await facturacionMiddleware.crearReqAPIWSFEparaNC(factura, local, fechaCbte, datosFiscales);
    // console.log(datos)
    // enviar req a AFIP
    let CAE = await new Promise((res) => res(facturacionMiddleware.fetchAPIWSFE(datos)));
    // console.log(CAE)
    let orden;
    if(CAE.error){
      console.log("Error detectado en CAE" + CAE.error);
      return res.send({error: CAE.error, resultado: false, imprimir: false, tipo: "CAE"});
    } else {
      orden = await servicesFacturacion.insertNCConCAE(CAE, datos, fecha);
      return res.send({error: false, resultado: true, imprimir: false, tipo: "CAE", numero: orden});
    }
  }
}
  
const facturacionComprobante = async (req, res) => {
  if (!req.query.id) {
    return res.send({error: "Datos de consulta incorrectos"});
  } else if (isNaN(parseInt(req.query.id))) {
    return res.send({error: "Datos de consulta incorrectos"});
  }
  let factura = await servicesFacturacion.getFacturaNF(req.query.id, req.session.userLocal);
  if (factura.length !== 1) {
    return res.send({error: "Datos de consulta incorrectos"});
  }
  factura = factura[0];
  return res.send(factura);
};

const facturacionComprobanteParcial = async (req, res) => {
  if (!req.query.id) {
    return res.send({error: "Datos de consulta incorrectos"});
  } else if (isNaN(parseInt(req.query.id))) {
    return res.send({error: "Datos de consulta incorrectos"});
  }
  let factura = await servicesFacturacion.getFacturaNF(req.query.id, req.session.userLocal);
  if (factura.length !== 1) {
    return res.send({error: "Datos de consulta incorrectos"});
  }
  factura = factura[0];
  return res.send(factura);
};

const facturacionComprobanteFiscal = async (req, res) => {
  if (!req.query.id) {
    return res.send({error: "Datos de consulta incorrectos"});
  } else if (isNaN(parseInt(req.query.id))) {
    return res.send({error: "Datos de consulta incorrectos"});
  }
  let factura = await servicesFacturacion.getFacturaCAE(req.query.id, req.session.userLocal);
  if (factura.length !== 1) {
    return res.send({error: "Datos de consulta incorrectos"});
  }
  factura = factura[0];
  return res.send(factura);
};

const facturacionFabrica = async (req, res) => {
  let fecha;
  if (req.query.fecha && !isNaN(Number(req.query.fecha)) && req.query.fecha.length == 8) {
    fecha = req.query.fecha;
  } else {
    fecha = await facturacionMiddleware.fechaHoy();
  }
  if (fecha === undefined) {
    return res.redirect("/panel");
  }
  let fechaHyphen = await facturacionMiddleware.fechaHyphen(fecha)
  let fechaNormalizada = await facturacionMiddleware.fechaNormalizada(fecha)
  const locales = await servicesLocal.getLocalesHistoricos();
  const localesConFacturacion = await localMiddleware.localesConFacturacion(locales);
  const facturacionDiaria = await facturacionMiddleware.calcularFacturacionxFechaxLocal(localesConFacturacion, fechaHyphen)
  res.render(__basedir + "/src/views/pages/facturacionFabrica", {
    locales,
    fechaHyphen,
    fechaNormalizada,
    localesConFacturacion,
    facturacionDiaria,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const facturacionRegistros = async (req, res) => {
  let fecha;
  if (req.query.fecha && !isNaN(Number(req.query.fecha)) && req.query.fecha.length == 8) {
    fecha = req.query.fecha;
  } else {
    fecha = await facturacionMiddleware.fechaHoy();
  }
  if (fecha === undefined) {
    return res.redirect("/panel");
  }
  let fechaHyphen = await facturacionMiddleware.fechaHyphen(fecha)
  let fechaNormalizada = await facturacionMiddleware.fechaNormalizada(fecha)
  let facturasNF = await servicesFacturacion.getFacturasNFxfecha(req.session.userLocal, fechaHyphen);
  let facturasCAE = await servicesFacturacion.getFacturasCAExfecha(req.session.userLocal, fechaHyphen);
  let facturas = facturasNF.concat(facturasCAE);
  facturas.sort((a, b) => a.fechaevento - b.fechaevento);
  const resumen = await facturacionMiddleware.crearResumenVistaLocal(facturas);
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  const local = await servicesLocal.getLocal(req.session.userLocal);

  const productos = await servicesProductos.getProductosLocalTodos();
  const datosFiscales = await servicesLocal.getDatosFiscales(req.session.userLocal);
  const botonesPersonalizados = await servicesProductos.getProductosPersonalizadosxLocalTodos(req.session.userLocal)

  res.render(__basedir + "/src/views/pages/facturacionLocalRegistros", {
    resumen,
    facturas,
    fechaNormalizada,
    fechaHyphen,
    local,
    productos,
    datosFiscales,
    botonesPersonalizados,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    servicios,
  })
};

const facturacionRegistrosSenias = async (req, res) => {
  let dias = 15;
  if(req.query.resultados){
    if(!isNaN(parseInt(req.query.resultados))){
      // console.log("ping")
      dias = parseInt(req.query.resultados);
    }
  } 
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  let senias = await servicesFacturacion.getSenias(req.session.userLocal);
  const fecha = await facturacionMiddleware.fechaHoy();
  const fechaHyphen = await facturacionMiddleware.fechaHyphen(fecha);
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  // console.log(fechaHyphen)
  res.render(__basedir + "/src/views/pages/facturacionLocalSenias", {
    errores,
    dias,
    fechaHyphen,
    senias,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    servicios,
  })
}

const facturacionSeniasActualizarEstado = async (req, res) => {
  if(isNaN(parseInt(req.query.id)) && (req.query.accion !== "registrar" || req.query.accion !== "cancelar")){
    return res.redirect("/panel/facturacion/registros/senias?error=query1");
  }
  const datosSenia = await servicesFacturacion.getSenia(req.session.userLocal, req.query.id);
  if(datosSenia == undefined){
    return res.redirect("/panel/facturacion/registros/senias?error=query2");
  }
  let observaciones = JSON.parse(datosSenia.observaciones);
  if(req.query.accion === "registrar"){
    observaciones.estadoSenia = "retirado";
  } else if(req.query.accion === "cancelar"){
    observaciones.estadoSenia = "cancelado";
  }
  observaciones = JSON.stringify(observaciones)
  await servicesFacturacion.updateSenias(req.query.id, observaciones)
  res.redirect("/panel/facturacion/registros/senias");
}

const facturacionFabricaBotones = async (req, res) => {
  const botonesfacturacion = await servicesFacturacion.getBotonesFacturacionTodos();
  const productos = await servicesProductos.getProductosLocal();
  let errores = await erroresMiddleware.erroresGral(req.query.error);

  res.render(__basedir + "/src/views/pages/facturacionBotones", {
    errores,
    botonesfacturacion,
    productos,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const facturacionFabricaBotonesNuevo = async (req, res) => {
  const proxId = await servicesProductos.lastId("botonesfacturacion");
  const productos = await servicesProductos.getProductosLocal();
  res.render(__basedir + "/src/views/pages/nuevoBotonFacturacion", {
    proxId,
    productos,
    valoresForm: {},
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const facturacionFabricaBotonesInsert = async(req, res) => {
  await servicesFacturacion.insertBotonFacturacion(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Nuevo boton rápido", `Codigo de prod ${req.body.codigo}`);
  return res.redirect("/panel/facturacion/fabrica/botones")
}

const facturacionFabricaBotonesEditar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect("/panel/facturacion/fabrica/botones?error=query1");
  }
  let data = await servicesFacturacion.getBotonFacturacion(req.query.id);
  if(data === undefined){
    return res.redirect("/panel/facturacion/fabrica/botones?error=query2");
  }
  const productos = await servicesProductos.getProductosLocal();
  res.render(__basedir + "/src/views/pages/editarBotonFacturacion", {
    productos,
    valoresForm: data,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const facturacionFabricaBotonesUpdate = async (req, res) => {
  await servicesFacturacion.updateBotonFacturacion(req.body);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Modificacion botones rápidos de faturacion", `Codigo de prod ${req.body.codigo}`);
  res.redirect("/panel/facturacion/fabrica/botones");
}

const facturacionFabricaBotonesEliminar = async (req, res) => {
  if(req.query.id){
    if(!isNaN(parseInt(req.query.id))){
      let data = await servicesFacturacion.getBotonFacturacion(req.query.id);
      if(data !== undefined){
        await servicesFacturacion.deleteBotonFacturacion(req.query.id);
      }
    }
  }
  return res.redirect("/panel/facturacion/fabrica/botones");
}

/* const facturacionCheckAfip = async (req, res) => {
  const estado = servicesAfip.checkDummy();
  res.render(__basedir + "/src/views/pages/facturacionCheckAfip", {
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
} */

const gastosLocal = async (req, res) => {
  let fecha;
  if (req.query.fecha && !isNaN(Number(req.query.fecha)) && req.query.fecha.length == 8) {
    fecha = req.query.fecha;
  } else {
    fecha = await facturacionMiddleware.fechaHoy();
  }
  if (fecha === undefined) {
    return res.redirect("/panel");
  }
  let fechaHyphen = await facturacionMiddleware.fechaHyphen(fecha);
  let fechaNormalizada = await facturacionMiddleware.fechaNormalizada(fecha);
  const gastos = await servicesGastos.getGastosFecha(req.session.userLocal, fechaHyphen);
  const resumenGastos = await gastosMiddleware.crearResumenGastos(gastos);
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  res.render(__basedir + "/src/views/pages/gastosLocal", {
    gastos,
    resumenGastos,
    fechaHyphen,
    fechaNormalizada,
    servicios,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const gastosLocalInsert = async (req, res) => {
  // verificar estado de caja previo registro
  const registrosDeCaja = await servicesCaja.getCierres(req.session.userLocal);
  const estadoDeCaja = await cajaMiddleware.estadoDeCaja(registrosDeCaja);
  if(estadoDeCaja.error){
    return res.send({error: "Caja cerrada, abra un nueva caja para operar", resultado: false, imprimir: false, tipo: "Gasto"});
  }
  
  const datos = await gastosMiddleware.crearObjetoGastos(req.body, req.session.userLog, req.session.userLocal);
  const resultado = await servicesGastos.insertGasto(datos);
  if(resultado.affectedRows == 1){
    return res.send({error: "", resultado: true, imprimir: false, tipo: "Gasto"});
  } else {
    return res.send({error: resultado.error, resultado: false, imprimir: false, tipo: "Gasto"});
  }
}

const facturacionLocalProdPers = async (req, res) => {
  const productosPers = await servicesProductos.getProductosPersonalizadosxLocal(req.session.userLocal);
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  res.render(__basedir + "/src/views/pages/facturacionLocalProdPers", {
    productosPers,
    servicios,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const facturacionLocalProdPersNuevo = async (req, res) => {
  /* let productoPers;
  if(req.query.id){
    if(!isNaN(parseInt(req.query.id))){
      productoPers = await servicesProductos.getProductoPersonalizados(req.query.id, req.session.userLocal);
    }
  } */
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  res.render(__basedir + "/src/views/pages/nuevoProductoPers", {
    valores: {},
    servicios,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const facturacionLocalProdPersInsert = async (req, res) => {
  let errores = validationResult(req);
  const productosPers = await servicesProductos.getProductosPersonalizadosxLocal(req.session.userLocal);
  let checkCodigo = await productosMiddleware.buscarDuplicadosProdPersonalizados(req.body.codigo, productosPers);
  if(checkCodigo.error){errores.errors.push(checkCodigo)}
  if (!errores.isEmpty()) {
    const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
    return res.render(__basedir + "/src/views/pages/nuevoProductoPers", {
      errores: errores.array({ onlyFirstError: true }),
      error: checkCodigo.msg,
      valores: req.body,
      servicios,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
  
  await servicesProductos.insertProductosPersonalizados(req.body, req.session.userLocal);
  return res.redirect("/panel/facturacion/local/productos/personalizados");
}

const facturacionLocalProdPersEditar = async (req, res) => {
  let productoPers;
  if(req.query.id){
    if(!isNaN(parseInt(req.query.id))){
      productoPers = await servicesProductos.getProductoPersonalizados(req.query.id, req.session.userLocal);
    }
    if(productoPers === undefined){
      return res.redirect("/panel/facturacion/local/productos/personalizados");
    }
  }
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  res.render(__basedir + "/src/views/pages/editarProductoPers", {
    valores: productoPers,
    servicios,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const facturacionLocalProdPersUpdate = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
    return res.render(__basedir + "/src/views/pages/editarProductoPers", {
      errores: errores.array({ onlyFirstError: true }),
      valores: req.body,
      servicios,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    });
  }
 
  await servicesProductos.updateProductosPersonalizados(req.body, req.session.userLocal);
  return res.redirect("/panel/facturacion/local/productos/personalizados");
}

const facturacionLocalProdPersEliminar = async (req, res) => {
  if(req.query.id){
    if(!isNaN(parseInt(req.query.id))){
      let data = await servicesProductos.getProductoPersonalizados(req.query.id, req.session.userLocal);
      if(data !== undefined){
        await servicesProductos.deleteProductosPersonalizados(req.query.id, req.session.userLocal);
      }
    }
  }
  return res.redirect("/panel/facturacion/local/productos/personalizados");
}

const localCierreDeCaja = async (req, res) => {

  let dias = 7;
  if(req.query.resultados){
    if(!isNaN(parseInt(req.query.resultados))){
      dias = parseInt(req.query.resultados);
    }
  }

  const fecha = await facturacionMiddleware.fechaHoy();
  const fechaHyphen = await facturacionMiddleware.fechaHyphen(fecha);
  const registros = await servicesCaja.getCierres(req.session.userLocal);
  let errores = await cajaMiddleware.ceirreCajaErrores(req.query.errores);
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);

  res.render(__basedir + "/src/views/pages/cierreCaja", {
    dias,
    fechaHyphen,
    registros,
    servicios,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
    errores,
  })
}

const localCierreDeCajaApertura = async (req, res) => {
  const registros = await servicesCaja.getCierres(req.session.userLocal);
  if(registros.length > 0 && registros[0].cierre === null){
    return res.redirect(`/panel/local/caja/cierre?errores=1`);
  }

  let facturas = [];
  let gastos = [];
  let calcularApertura = {
    efectivo: 0,
  }
  let resumen;
  let resumenGastos;

  if(registros.length > 0){
    fecha = registros[0].cierre;
    fecha = JSON.parse(fecha);
    fecha = fecha.fecha;
  
    let facturasNF = await servicesFacturacion.getFacturasNFxEvento(req.session.userLocal, fecha);
    let facturasCAE = await servicesFacturacion.getFacturasCAExEvento(req.session.userLocal, fecha);
    facturas = facturasNF.concat(facturasCAE);
    facturas.sort((a, b) => a.fechaevento - b.fechaevento);
    resumen = await facturacionMiddleware.crearResumenCajaLocal(facturas);
    gastos = await servicesGastos.getGastosxEvento(req.session.userLocal, fecha);
    resumenGastos = await gastosMiddleware.crearResumenGastos(gastos);
    calcularApertura = await cajaMiddleware.calcularApertura(resumen, resumenGastos, registros[0]);
  }
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);

  res.render(__basedir + "/src/views/pages/cierreCajaApertura", {
    registros,
    servicios,
    facturas,
    resumen,
    gastos,
    resumenGastos,
    calcularApertura,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const localCierreDeCajaAperturaInsert = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const registros = await servicesCaja.getCierres(req.session.userLocal);
    const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
    const fecha = await facturacionMiddleware.fechaHoy();
    const fechaHyphen = await facturacionMiddleware.fechaHyphen(fecha);

    return res.render(__basedir + "/src/views/pages/cierreCaja", {
      errores: errores.array({ onlyFirstError: true }),
      registros,
      servicios,
      dias: 7,
      fechaHyphen,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    })
  }


  const registros = await servicesCaja.getCierres(req.session.userLocal);
  let numeracion;
  if(registros.length === 0){
    numeracion = 1;
  } else {
    numeracion = parseInt(registros[0].numero) + 1;
  }
  
  let fecha = await facturacionMiddleware.fechaHoy();
  fecha = await facturacionMiddleware.fechaHyphen(fecha);
  let apertura = await cajaMiddleware.crearObjApertura(req.body, req.session.userLog);
  apertura = JSON.stringify(apertura);
  await servicesCaja.insertCaja(apertura, fecha, req.session.userLocal, numeracion);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Apertura de caja", `Id de caja: ${numeracion}`);
  return res.redirect("/panel/local/caja/cierre");
}

const localCierreDeCajaCerrar = async (req, res) => {
  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect(`/panel/local/caja/cierre?errores=2`);
  }
  const registro = await servicesCaja.getCierresxId(req.session.userLocal, req.query.id);
  if(registro.length !== 1){
    return res.redirect(`/panel/local/caja/cierre?errores=2`);
  } else if(registro[0].cierre !== null){
    return res.redirect(`/panel/local/caja/cierre?errores=3`);
  }

  let fecha = registro[0].inicio;
  fecha = JSON.parse(fecha);
  fecha = fecha.fecha;

  let facturasNF = await servicesFacturacion.getFacturasNFxEvento(req.session.userLocal, fecha);
  let facturasCAE = await servicesFacturacion.getFacturasCAExEvento(req.session.userLocal, fecha);
  let facturas = facturasNF.concat(facturasCAE);
  facturas.sort((a, b) => a.fechaevento - b.fechaevento);
  const resumen = await facturacionMiddleware.crearResumenCajaLocal(facturas);
  const resumenGeneral = await facturacionMiddleware.crearResumenVistaLocal(facturas);
  const gastos = await servicesGastos.getGastosxEvento(req.session.userLocal, fecha);
  const resumenGastos = await gastosMiddleware.crearResumenGastos(gastos);
  const calcularCierre = await cajaMiddleware.calcularCierre(resumen, resumenGastos, registro[0]);
  const reporte = await cajaMiddleware.crearReporteCaja(facturas, resumenGeneral, resumenGastos);
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  res.render(__basedir + "/src/views/pages/cierreCajaCerrar", {
    registro: registro[0],
    servicios,
    resumen,
    resumenGeneral,
    facturas,
    gastos,
    resumenGastos,
    fecha,
    reporte,
    calcularCierre,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

const localCierreDeCajaCerrarInsert = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const registros = await servicesCaja.getCierres(req.session.userLocal);
    const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
    const fecha = await facturacionMiddleware.fechaHoy();
    const fechaHyphen = await facturacionMiddleware.fechaHyphen(fecha);
    
    return res.render(__basedir + "/src/views/pages/cierreCaja", {
      errores: errores.array({ onlyFirstError: true }),
      registros,
      servicios,
      dias: 7,
      fechaHyphen,
      usuario: req.session.userLog,
      userRol: req.session.userRol,
    })
  }

  let cierre = await cajaMiddleware.crearObjCierre(req.body, req.session.userLog);
  cierre = JSON.stringify(cierre);
  await servicesCaja.updateCierreCaja(cierre, req.body.id, req.body.reporte);
  await servicesActividad.insertActividad(req.session.userLocal, 0, req.session.userLog, "Cierre de caja", `Id de caja: ${req.body.id}`);
  // grabar reporte de caja


  return res.redirect(`/panel/local/caja/cierre`);
}

const localCierreDeCajaApi = async (req, res) => {
  const registros = await servicesCaja.getCierres(req.session.userLocal);
  const estadoDeCaja = await cajaMiddleware.estadoDeCaja(registros);
  return res.send(JSON.stringify(estadoDeCaja));
}

const localCierreDeCajaReporte = async (req, res) => {

  if(!req.query.id || isNaN(parseInt(req.query.id))){
    return res.redirect(`/panel/local/caja/cierre?errores=2`);
    
  }
  const registro = await servicesCaja.getCierresxId(req.session.userLocal, req.query.id);
  if(registro.length !== 1){
    return res.redirect(`/panel/local/caja/cierre?errores=2`);
  } else if(registro[0].cierre === null){
    return res.redirect(`/panel/local/caja/cierre?errores=4`);
  }

  let fecha = registro[0].inicio;
  fecha = JSON.parse(fecha);
  fecha = fecha.fecha;
  const local = await servicesLocal.getLocal(req.session.userLocal);
  const gastos = await servicesGastos.getGastosxEvento(req.session.userLocal, fecha);
  const resumenGastos = await gastosMiddleware.crearResumenGastos(gastos);
  const productos = await servicesProductos.getProductosLocalTodos();
  const productosPersonalizados = await servicesProductos.getProductosPersonalizadosxLocal(req.session.userLocal);
  // Agregar consulta de  productos personalizados y filtraros en la vista del reporte por el numero de codigo (>100)

  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  res.render(__basedir + "/src/views/pages/cierreCajaReporte", {
    registro: registro[0],
    productos,
    productosPersonalizados,
    servicios,
    local,
    gastos,
    resumenGastos,
    fecha,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })

}

const facturacionConsultaPadron = async (req, res) => {
  if(isNaN(parseInt(req.body.idPersona)) || req.body.idPersona.toString().length !== 11){
    return res.send({data: {error: true, msg: "Formato de CUIT incorrecto"}})
  }
  // consultar estado del servidor
  const local = await servicesLocal.getLocal(req.session.userLocal);
  const estadoDeServidor = await facturacionMiddleware.checkServerPadron(local.testing);
  if(estadoDeServidor.data.error){
    return res.send({data: estadoDeServidor.data});
  }
  // consultar padron
  const datosFiscales = await servicesLocal.getDatosFiscales(req.session.userLocal);
  const infoPersona = await facturacionMiddleware.consultarPadron(local.testing, req.body.idPersona, datosFiscales.cuit);
  return res.send({data: infoPersona.data})
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
  local,
  localEditar,
  localUpdate,
  localNuevo,
  localInsert,
  localEliminar,
  localDatosFiscales,
  localDatosFiscalesInsert,
  precios,
  preciosUpdate,
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
  usuariosLocal,
  usuariosLocalNuevo,
  usuariosLocalInsert,
  usuariosLocalEliminar,
  usuariosLocalEditar,
  usuariosLocalUpdate,
  // pedidos,
  // pedidosEstado,
  actividad,
  actividadToda,
  actividadTodaFiltro,
  // stockForm,
  // stockUpdate,
  pedidoProduccionLocal,
  pedidoProduccionLocalTabla,
  pedidoProduccionFabrica,
  pedidoProduccionFabricaTabla,
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
  preciosProductosFabrica,
  preciosProductosFabricaUpdate,
  pedidoProduccionPersonalizadoNuevo,
  pedidoProduccionPersonalizadoCrear,
  categoriasFabrica,
  categoriasFabricaNueva,
  categoriasFabricaInsert,
  categoriasFabricaEditar,
  categoriasFabricaUpdate,
  categoriasFabricaEliminar,
  fotosProductosFabrica,
  nuevaFotoProductoFabrica,
  uploadNuevaFotoProductoFabrica,
  reportes,
  reportesSelector,
  reportePlanta,
  reportePlantaCategorias,
  reportePlantaCategoriasEliminar,
  reportePlantaCategoriasNueva,
  reportePlantaCategoriasEditar,
  reportePlantaCategoriasInsert,
  reportePlantaCategoriasUpdate,
  reportePedidos,
  reporteValorizado,
  servicios,
  servicioNuevo,
  servicioInsert,
  servicioEliminar,
  facturacion,
  facturacionPost,
  facturacionConsultaPadron,
  facturacionNC,
  facturacionComprobante,
  facturacionComprobanteParcial,
  facturacionComprobanteFiscal,
  facturacionFabrica,
  facturacionRegistros,
  facturacionRegistrosSenias,
  facturacionSeniasActualizarEstado,
  facturacionFabricaBotones,
  facturacionFabricaBotonesNuevo,
  facturacionFabricaBotonesInsert,
  facturacionFabricaBotonesEditar,
  facturacionFabricaBotonesUpdate,
  facturacionFabricaBotonesEliminar,
  // facturacionCheckAfip,
  gastosLocal,
  gastosLocalInsert,
  facturacionLocalProdPers,
  facturacionLocalProdPersNuevo,
  facturacionLocalProdPersInsert,
  facturacionLocalProdPersEditar,
  facturacionLocalProdPersUpdate,
  facturacionLocalProdPersEliminar,
  localCierreDeCaja,
  localCierreDeCajaApertura,
  localCierreDeCajaAperturaInsert,
  localCierreDeCajaCerrar,
  localCierreDeCajaCerrarInsert,
  localCierreDeCajaApi,
  localCierreDeCajaReporte,
};