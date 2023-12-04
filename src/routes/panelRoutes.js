const express = require("express");
const router = express.Router();
const panelControllers = require("../controllers/panelControllers");
const fileUpload = require("../services/fileUpload");
const validar = require("../middlewares/validador");
const auth = require("../middlewares/auth")

// const { conectar } = require(__basedir + "/src/config/dbConnection");

router.get("/", panelControllers.index);

router.get("/productos/card", auth.authSupervisor, panelControllers.productosCard);

router.get("/productos/tabla", auth.authSupervisor, panelControllers.productosTabla);

router.get("/productos/editar", auth.authSupervisor, panelControllers.productosEditar);

router.post("/productos/editar", auth.authSupervisor, validar.validarProductoChain, panelControllers.productosUpdate);

router.get("/productos/nuevo", auth.authSupervisor, panelControllers.productosNuevo);

router.post("/productos/nuevo", auth.authSupervisor, validar.validarProductoChain, panelControllers.productosInsert);

router.get("/productos/eliminar", auth.authSupervisor, panelControllers.productosEliminar);

router.get("/stock", panelControllers.stockForm);

router.post("/stock", panelControllers.stockUpdate);

router.get("/categorias", auth.authSupervisor, panelControllers.categoriasTabla);

router.get("/categorias/editar", auth.authSupervisor, panelControllers.categoriasEditar);

router.post("/categorias/editar", auth.authSupervisor, validar.validarNuevaCategoriaChain, panelControllers.categoriasUpdate);

router.get("/categorias/nueva", auth.authSupervisor, panelControllers.categoriasNueva);

router.post("/categorias/nueva", auth.authSupervisor, validar.validarNuevaCategoriaChain, panelControllers.categoriasInsert);

router.get("/categorias/eliminar", auth.authSupervisor, panelControllers.categoriasEliminar);

router.get("/precios", auth.authSupervisor, panelControllers.precios);

router.post("/precios", auth.authSupervisor, validar.validarPreciosChain, panelControllers.preciosUpdate);

router.get("/local", auth.authSupervisor, panelControllers.local);

router.get("/local/editar", auth.authSupervisor, panelControllers.localEditar);

router.post("/local/editar", auth.authSupervisor, validar.validarLocalesChain, panelControllers.localUpdate);

router.get("/local/nuevo", auth.authSupervisor, panelControllers.localNuevo);

router.post("/local/nuevo", auth.authSupervisor, validar.validarLocalesChain, panelControllers.localInsert);

router.get("/local/eliminar", auth.authSupervisor, panelControllers.localEliminar);

router.get("/fotos", auth.authSupervisor, panelControllers.fotos);

router.get("/fotos/productos", auth.authSupervisor, panelControllers.fotosProductos);

router.get("/fotos/locales", auth.authSupervisor, panelControllers.fotosLocales);

router.get("/fotos/categorias", auth.authSupervisor, panelControllers.fotosCategorias);

router.get("/fotos/nueva", auth.authSupervisor, panelControllers.fotosNueva);

router.post("/fotos/nueva", auth.authSupervisor, fileUpload.subirArchivo.single("foto"), panelControllers.fotosNuevaSubida);

router.get("/usuarios", auth.authSupervisor, panelControllers.usuarios);

router.get("/usuarios/nuevo", auth.authSupervisor, panelControllers.usuariosNuevo);

router.post("/usuarios/nuevo", auth.authSupervisor, validar.validarUsuariosChain, panelControllers.usuariosInsert);

router.get("/usuarios/editar", auth.authSupervisor, panelControllers.usuariosEditar);

router.post("/usuarios/editar", auth.authSupervisor, validar.validarUsuariosUpdateChain, panelControllers.usuariosUpdate);

router.get("/usuarios/eliminar", auth.authSupervisor, panelControllers.usuariosEliminar);

router.get("/pedidos", panelControllers.pedidos);

router.post("/pedidos", panelControllers.pedidosEstado);

router.get("/actividad", panelControllers.actividad);

router.get("/actividadToda", auth.authSupervisor, panelControllers.actividadToda);

router.get("/produccionLocal", auth.authAdmin, panelControllers.pedidoProduccionLocal);

router.post("/produccionLocal", auth.authAdmin, panelControllers.pedidoProduccionAgregarMensajeLocal);

router.post("/produccionLocalUpdateEstado", auth.authAdmin, panelControllers.pedidoProduccionUpdateEstado);

router.get("/produccion/nueva", auth.authAdmin, panelControllers.pedidoProduccionNuevo);

router.post("/produccion/nueva", auth.authAdmin, panelControllers.pedidoProduccionInsert);

router.get("/produccionFabrica", auth.authSupervisor, panelControllers.pedidoProduccionFabrica);

router.post("/produccionFabrica", auth.authSupervisor, panelControllers.pedidoProduccionAgregarMensajeFabrica);

router.post("/produccionFabricaUpdateEstado", auth.authSupervisor, panelControllers.pedidoProduccionUpdateEstado);

router.get("/editarPedidoProduccion", auth.authSupervisor, panelControllers.pedidoProduccionEditar);

router.post("/editarPedidoProduccion", auth.authSupervisor, panelControllers.pedidoProduccionUpdate);

router.get("/productosFabrica", auth.authSupervisor, panelControllers.productosFabrica);

router.get("/productosFabrica/nuevo", auth.authSupervisor, panelControllers.productosFabricaNuevo);

module.exports = router;