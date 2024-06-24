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

router.get("/local/fiscal", auth.authSupervisor, panelControllers.localDatosFiscales);

router.post("/local/fiscal", auth.authSupervisor, validar.validarDatosFiscalesChain, panelControllers.localDatosFiscalesInsert);

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
// ticket 005
router.post("/usuarios/editar", auth.authSupervisor, validar.validarUsuariosUpdateChain, panelControllers.usuariosUpdate);
// ticket 005
router.get("/usuarios/eliminar", auth.authSupervisor, panelControllers.usuariosEliminar);

router.get("/usuarios/local", auth.authAdmin, panelControllers.usuariosLocal);

router.get("/usuarios/local/nuevo", auth.authAdmin, panelControllers.usuariosLocalNuevo);

router.post("/usuarios/local/nuevo", auth.authAdmin, validar.validarUsuariosChain, panelControllers.usuariosLocalInsert);
// ticket 005
router.get("/usuarios/local/eliminar", auth.authAdmin, panelControllers.usuariosLocalEliminar);
// ticket 005
router.get("/usuarios/local/editar", auth.authAdmin, panelControllers.usuariosLocalEditar);

router.post("/usuarios/local/editar", auth.authAdmin, validar.validarUsuariosUpdateChain, panelControllers.usuariosLocalUpdate);



// router.get("/pedidos", panelControllers.pedidos);

// router.post("/pedidos", validar.validarPedidoEstadoChain, panelControllers.pedidosEstado);

// router.get("/actividad", panelControllers.actividad);

router.get("/actividadToda", auth.authSupervisor, panelControllers.actividadToda);

router.post("/actividadToda", auth.authSupervisor, validar.validarQueryActividadChain, panelControllers.actividadTodaFiltro);

router.get("/produccion/local", auth.authAdmin, panelControllers.pedidoProduccionLocal);

router.post("/produccion/local", auth.authAdmin, validar.validarStringsChain, panelControllers.pedidoProduccionAgregarMensajeLocal);

router.post("/produccion/local/updateEstado", auth.authAdmin, validar.validarStringsChain, panelControllers.pedidoProduccionUpdateEstado);

router.get("/produccion/local/tabla", auth.authAdmin, panelControllers.pedidoProduccionLocalTabla);

router.get("/produccion/nueva", auth.authAdmin, panelControllers.pedidoProduccionNuevo);

router.post("/produccion/nueva", auth.authAdmin, panelControllers.pedidoProduccionInsert);

router.get("/produccion/fabrica", auth.authSupervisor, panelControllers.pedidoProduccionFabrica);

router.post("/produccion/fabrica", auth.authSupervisor, validar.validarStringsChain, panelControllers.pedidoProduccionAgregarMensajeFabrica);

router.get("/produccion/fabrica/tabla", auth.authSupervisor, panelControllers.pedidoProduccionFabricaTabla);

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

router.get("/produccion/reportes/categorias", auth.authSupervisor, panelControllers.reportePlantaCategorias);

router.get("/produccion/reportes/categorias/nueva", auth.authSupervisor, panelControllers.reportePlantaCategoriasNueva);

router.post("/produccion/reportes/categorias/nueva", auth.authSupervisor, validar.validarCategoriaReporteChain, panelControllers.reportePlantaCategoriasInsert);

router.get("/produccion/reportes/categorias/editar", auth.authSupervisor, panelControllers.reportePlantaCategoriasEditar);

router.post("/produccion/reportes/categorias/editar", auth.authSupervisor, panelControllers.reportePlantaCategoriasUpdate);

router.get("/produccionreportescategorias/eliminar", auth.authSupervisor, panelControllers.reportePlantaCategoriasEliminar);

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

router.post("/facturacion", auth.authAdmin, validar.validarFacturacionChain, panelControllers.facturacionPost);

router.post("/facturacion/padron/api", auth.authAdmin, panelControllers.facturacionConsultaPadron);

router.get("/facturacion/nc", auth.authAdmin, panelControllers.facturacionNC);

router.get("/facturacion/comprobante", auth.authAdmin, panelControllers.facturacionComprobante);

router.get("/facturacion/comprobante/parcial", auth.authAdmin, panelControllers.facturacionComprobanteParcial);

router.get("/facturacion/comprobante/fiscal", auth.authAdmin, panelControllers.facturacionComprobanteFiscal);

router.get("/facturacion/registros", auth.authAdmin, panelControllers.facturacionRegistros);

router.get("/facturacion/registros/senias", auth.authAdmin, panelControllers.facturacionRegistrosSenias);

router.get("/facturacion/registros/senias/actualizar", auth.authAdmin, panelControllers.facturacionSeniasActualizarEstado);

router.get("/facturacion/registros/gastos", auth.authAdmin, panelControllers.gastosLocal);

router.post("/facturacion/registros/gastos/nuevo", auth.authAdmin, validar.validarGastosChain, panelControllers.gastosLocalInsert);

// router.get("/facturacion/registros/notadecredito", auth.authAdmin, panelControllers.facturacionNotaDeCredito);

router.get("/facturacion/fabrica", auth.authSupervisor, panelControllers.facturacionFabrica);

router.get("/facturacion/fabrica/botones", auth.authSupervisor, panelControllers.facturacionFabricaBotones);

router.get("/facturacion/fabrica/botones/nuevo", auth.authSupervisor, panelControllers.facturacionFabricaBotonesNuevo);

router.post("/facturacion/fabrica/botones/nuevo", auth.authSupervisor, validar.validarBotonFacturacionChain, panelControllers.facturacionFabricaBotonesInsert);

router.get("/facturacion/fabrica/botones/editar", auth.authSupervisor, panelControllers.facturacionFabricaBotonesEditar);

router.post("/facturacion/fabrica/botones/editar", auth.authSupervisor, validar.validarBotonFacturacionChain, panelControllers.facturacionFabricaBotonesUpdate);

router.get("/facturacion/fabrica/botones/eliminar", auth.authSupervisor, panelControllers.facturacionFabricaBotonesEliminar);

// router.get("/facturacion/checkAFIP", auth.authAdmin, panelControllers.facturacionCheckAfip);

router.get("/facturacion/local/productos/personalizados", auth.authAdmin, panelControllers.facturacionLocalProdPers);

router.get("/facturacion/local/productos/personalizados/nuevo", auth.authAdmin, panelControllers.facturacionLocalProdPersNuevo);

router.post("/facturacion/local/productos/personalizados/nuevo", auth.authAdmin, validar.validarProductoPersChain, panelControllers.facturacionLocalProdPersInsert);

router.get("/facturacion/local/productos/personalizados/editar", auth.authAdmin, panelControllers.facturacionLocalProdPersEditar);

router.post("/facturacion/local/productos/personalizados/editar", auth.authAdmin, panelControllers.facturacionLocalProdPersUpdate);

router.get("/facturacion/local/productos/personalizados/eliminar", auth.authAdmin, panelControllers.facturacionLocalProdPersEliminar);

router.get("/local/caja/cierre", auth.authAdmin, panelControllers.localCierreDeCaja);

router.get("/local/caja/cierre/abrir", auth.authAdmin, panelControllers.localCierreDeCajaApertura);

router.post("/local/caja/cierre/abrir", auth.authAdmin, validar.validarCajaChain, panelControllers.localCierreDeCajaAperturaInsert);

router.get("/local/caja/cierre/cerrar", auth.authAdmin, panelControllers.localCierreDeCajaCerrar);

router.post("/local/caja/cierre/cerrar", auth.authAdmin, validar.validarCajaChain, panelControllers.localCierreDeCajaCerrarInsert);

router.post("/local/caja/api", auth.authAdmin, panelControllers.localCierreDeCajaApi);

router.get("/local/caja/reporte", auth.authAdmin, panelControllers.localCierreDeCajaReporte);



module.exports = router;