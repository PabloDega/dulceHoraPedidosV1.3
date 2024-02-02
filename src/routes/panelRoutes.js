const express = require("express");
const router = express.Router();
const panelControllers = require("../controllers/panelControllers");
const excelControllers = require("../controllers/excelControllers");
const fileUpload = require("../services/fileUpload");
const validar = require("../middlewares/validador");
const auth = require("../middlewares/auth")

router.get("/", panelControllers.index);

router.get("/productos/card", auth.authSupervisor, panelControllers.productosCard);

router.get("/productos/tabla", auth.authSupervisor, panelControllers.productosTabla);

router.get("/productos/editar", auth.authSupervisor, panelControllers.productosEditar);

router.post("/productos/editar", auth.authSupervisor, validar.validarProductoChain, panelControllers.productosUpdate);

router.get("/productos/nuevo", auth.authSupervisor, panelControllers.productosNuevo);

router.post("/productos/nuevo", auth.authSupervisor, validar.validarProductoChain, panelControllers.productosInsert);

router.get("/productos/eliminar", auth.authSupervisor, panelControllers.productosEliminar);

// router.get("/stock", panelControllers.stockForm);

// router.post("/stock", panelControllers.stockUpdate);

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

router.post("/pedidos", validar.validarPedidoEstadoChain, panelControllers.pedidosEstado);

router.get("/actividad", panelControllers.actividad);

router.get("/actividadToda", auth.authSupervisor, panelControllers.actividadToda);

router.post("/actividadToda", auth.authSupervisor, validar.validarQueryActividadChain, panelControllers.actividadTodaFiltro);

router.get("/produccion/local", auth.authAdmin, panelControllers.pedidoProduccionLocal);

router.post("/produccion/local", auth.authAdmin, validar.validarStringsChain, panelControllers.pedidoProduccionAgregarMensajeLocal);

router.post("/produccion/local/updateEstado", auth.authAdmin, validar.validarStringsChain, panelControllers.pedidoProduccionUpdateEstado);

router.get("/produccion/nueva", auth.authAdmin, panelControllers.pedidoProduccionNuevo);

router.post("/produccion/nueva", auth.authAdmin, panelControllers.pedidoProduccionInsert);

router.get("/produccion/fabrica", auth.authSupervisor, panelControllers.pedidoProduccionFabrica);

router.post("/produccion/fabrica", auth.authSupervisor, validar.validarStringsChain, panelControllers.pedidoProduccionAgregarMensajeFabrica);

router.post("/produccion/fabrica/updateEstado", auth.authSupervisor, validar.validarStringsChain, panelControllers.pedidoProduccionUpdateEstado);

router.get("/produccion/editar", auth.authAdmin, panelControllers.pedidoProduccionEditar);

router.post("/produccion/editar", auth.authAdmin, validar.validarProduccionUpdateChain, panelControllers.pedidoProduccionUpdate);

router.post("/produccion/exportar/excel", auth.authAdmin, excelControllers.exportarExcelProduccion);

router.get("/produccion/reportes", auth.authSupervisor, panelControllers.reportes);

router.post("/produccion/reportes", auth.authSupervisor, validar.validarStringsChain, panelControllers.reportesSelector);

router.get("/produccion/reportes/planta", auth.authSupervisor, panelControllers.reportePlanta);

router.post("/produccion/reporte/planta/exportar/excel", auth.authAdmin, excelControllers.exportarExcelReportePlanta);

router.get("/produccion/reportes/pedidos", auth.authSupervisor, panelControllers.reportePedidos);

router.post("/produccion/reporte/pedidos/exportar/excel", auth.authAdmin, excelControllers.exportarExcelReportePedidos);

router.get("/produccion/reportes/valorizado", auth.authSupervisor, panelControllers.reporteValorizado);

router.post("/produccion/reporte/valorizado/exportar/excel", auth.authAdmin, excelControllers.exportarExcelReporteValorizado);

router.get("/produccion/personalizado/nuevo", auth.authSupervisor, panelControllers.pedidoProduccionPersonalizadoNuevo);

router.post("/produccion/personalizado/nuevo", auth.authSupervisor, validar.validarStringsChain, panelControllers.pedidoProduccionPersonalizadoCrear);

router.get("/productosFabrica", auth.authSupervisor, panelControllers.productosFabrica);

router.get("/productosFabrica/nuevo", auth.authSupervisor, panelControllers.productosFabricaNuevo);

router.post("/productosFabrica/nuevo", auth.authSupervisor, validar.validarProductoFabricaChain, panelControllers.productosFabricaInsert);

router.get("/productosFabrica/editar", auth.authSupervisor, panelControllers.productosFabricaEditar);

router.post("/productosFabrica/editar", auth.authSupervisor, validar.validarProductoFabricaChain, panelControllers.productosFabricaUpdate);

router.get("/productosFabrica/eliminar", auth.authSupervisor, panelControllers.productosFabricaEliminar);

router.get("/categoriasFabrica", auth.authSupervisor, panelControllers.categoriasFabrica);

router.get("/categoriasFabrica/nueva", auth.authSupervisor, panelControllers.categoriasFabricaNueva);

router.post("/categoriasFabrica/nueva", auth.authSupervisor, validar.validarCategoriaFabricaChain, panelControllers.categoriasFabricaInsert);

router.get("/categoriasFabrica/editar", auth.authSupervisor, panelControllers.categoriasFabricaEditar);

router.post("/categoriasFabrica/editar", auth.authSupervisor, validar.validarCategoriaFabricaChain, panelControllers.categoriasFabricaUpdate);

router.get("/categoriasFabrica/eliminar", auth.authSupervisor, panelControllers.categoriasFabricaEliminar);

router.get("/productosFabrica/fotos", auth.authSupervisor, panelControllers.fotosProductosFabrica);

router.get("/productosFabrica/fotos/nueva", auth.authSupervisor, panelControllers.nuevaFotoProductoFabrica);

router.post("/productosFabrica/fotos/nueva", auth.authSupervisor, fileUpload.subirArchivo.single("foto"), panelControllers.uploadNuevaFotoProductoFabrica);

router.get("/productosFabrica/precios", auth.authSupervisor, panelControllers.preciosProductosFabrica);

router.post("/productosFabrica/precios", auth.authSupervisor, validar.validarPreciosChain, panelControllers.preciosProductosFabricaUpdate);

router.get("/servicios", auth.authSupervisor, panelControllers.servicios);

router.get("/servicios/nuevo", auth.authSupervisor, panelControllers.servicioNuevo);

router.post("/servicios/nuevo", auth.authSupervisor, validar.validarStringsChain, panelControllers.servicioInsert);

router.get("/servicios/eliminar", auth.authSupervisor, panelControllers.servicioEliminar);

router.get("/facturacion", auth.authAdmin, panelControllers.facturacion);

router.post("/facturacion", auth.authAdmin, panelControllers.facturacionPost);

router.get("/facturacion/fabrica", auth.authSupervisor, panelControllers.facturacionFabrica);

router.get("/facturacion/fabrica/botones", auth.authSupervisor, panelControllers.facturacionFabricaBotones);

router.get("/facturacion/fabrica/botones/nuevo", auth.authSupervisor, panelControllers.facturacionFabricaBotonesNuevo);



module.exports = router;