const express = require("express");
const router = express.Router();
const panelControllers = require("../controllers/panelControllers");
const excelControllers = require("../controllers/excelControllers");
const fileUpload = require("../services/fileUpload");
const validar = require("../middlewares/validador");
const auth = require("../middlewares/auth")

router.get("/", panelControllers.index);

router.get("/productos/card", auth.authProduccion, panelControllers.productosCard);

router.get("/productos/tabla", auth.authProduccion, panelControllers.productosTabla);

router.get("/productos/editar", auth.authProduccion, panelControllers.productosEditar);

router.post("/productos/editar", auth.authProduccion, validar.validarProductoChain, panelControllers.productosUpdate);

router.get("/productos/nuevo", auth.authProduccion, panelControllers.productosNuevo);

router.post("/productos/nuevo", auth.authProduccion, validar.validarProductoChain, panelControllers.productosInsert);

router.get("/productos/eliminar", auth.authProduccion, panelControllers.productosEliminar);

// router.get("/stock", panelControllers.stockForm);

// router.post("/stock", panelControllers.stockUpdate);

router.get("/categorias", auth.authProduccion, panelControllers.categoriasTabla);

router.get("/categorias/editar", auth.authProduccion, panelControllers.categoriasEditar);

router.post("/categorias/editar", auth.authProduccion, validar.validarNuevaCategoriaChain, panelControllers.categoriasUpdate);

router.get("/categorias/nueva", auth.authProduccion, panelControllers.categoriasNueva);

router.post("/categorias/nueva", auth.authProduccion, validar.validarNuevaCategoriaChain, panelControllers.categoriasInsert);

router.get("/categorias/eliminar", auth.authProduccion, panelControllers.categoriasEliminar);

router.get("/precios", auth.authProduccion, panelControllers.precios);

router.post("/precios", auth.authProduccion, validar.validarPreciosChain, panelControllers.preciosUpdate);

router.get("/local", auth.authProduccion, panelControllers.local);

router.get("/local/editar", auth.authProduccion, panelControllers.localEditar);

router.post("/local/editar", auth.authProduccion, validar.validarLocalesChain, panelControllers.localUpdate);

router.get("/local/nuevo", auth.authProduccion, panelControllers.localNuevo);

router.post("/local/nuevo", auth.authProduccion, validar.validarLocalesChain, panelControllers.localInsert);

router.get("/local/eliminar", auth.authProduccion, panelControllers.localEliminar);

router.get("/local/fiscal", auth.authProduccion, panelControllers.localDatosFiscales);

router.post("/local/fiscal", auth.authProduccion, validar.validarDatosFiscalesChain, panelControllers.localDatosFiscalesInsert);

router.get("/fotos", auth.authProduccion, panelControllers.fotos);

router.get("/fotos/productos", auth.authProduccion, panelControllers.fotosProductos);

router.get("/fotos/locales", auth.authProduccion, panelControllers.fotosLocales);

router.get("/fotos/categorias", auth.authProduccion, panelControllers.fotosCategorias);

router.get("/fotos/nueva", auth.authProduccion, panelControllers.fotosNueva);

router.post("/fotos/nueva", auth.authProduccion, fileUpload.subirArchivo.single("foto"), panelControllers.fotosNuevaSubida);

router.get("/usuarios", auth.authSupervisor, panelControllers.usuarios);

router.get("/usuarios/nuevo", auth.authSupervisor, panelControllers.usuariosNuevo);

router.post("/usuarios/nuevo", auth.authSupervisor, validar.validarUsuariosChain, panelControllers.usuariosInsert);

router.get("/usuarios/editar", auth.authSupervisor, panelControllers.usuariosEditar);

router.post("/usuarios/editar", auth.authSupervisor, validar.validarUsuariosUpdateChain, panelControllers.usuariosUpdate);

router.get("/usuarios/eliminar", auth.authSupervisor, panelControllers.usuariosEliminar);

router.get("/usuarios/local", auth.authAdmin, panelControllers.usuariosLocal);

router.get("/usuarios/local/nuevo", auth.authAdmin, panelControllers.usuariosLocalNuevo);

router.post("/usuarios/local/nuevo", auth.authAdmin, validar.validarUsuariosChain, panelControllers.usuariosLocalInsert);

router.get("/usuarios/local/eliminar", auth.authAdmin, panelControllers.usuariosLocalEliminar);

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

router.get("/produccion/fabrica", auth.authProduccion, panelControllers.pedidoProduccionFabrica);

router.post("/produccion/fabrica", auth.authProduccion, validar.validarStringsChain, panelControllers.pedidoProduccionAgregarMensajeFabrica);

router.get("/produccion/fabrica/tabla", auth.authProduccion, panelControllers.pedidoProduccionFabricaTabla);

router.post("/produccion/fabrica/updateEstado", auth.authProduccion, validar.validarStringsChain, panelControllers.pedidoProduccionUpdateEstado);

router.get("/produccion/editar", auth.authAdmin, panelControllers.pedidoProduccionEditar);

router.post("/produccion/editar", auth.authAdmin, validar.validarProduccionUpdateChain, panelControllers.pedidoProduccionUpdate);

router.post("/produccion/exportar/excel", auth.authAdmin, excelControllers.exportarExcelProduccion);

router.get("/produccion/reportes", auth.authProduccion, panelControllers.reportes);

router.post("/produccion/reportes", auth.authProduccion, validar.validarStringsChain, panelControllers.reportesSelector);

router.get("/produccion/reportes/planta", auth.authProduccion, panelControllers.reportePlanta);

router.post("/produccion/reporte/planta/exportar/excel", auth.authAdmin, excelControllers.exportarExcelReportePlanta);

router.get("/produccion/reportes/pedidos", auth.authProduccion, panelControllers.reportePedidos);

router.post("/produccion/reporte/pedidos/exportar/excel", auth.authAdmin, excelControllers.exportarExcelReportePedidos);

router.get("/produccion/reportes/valorizado", auth.authProduccion, panelControllers.reporteValorizado);

router.post("/produccion/reporte/valorizado/exportar/excel", auth.authAdmin, excelControllers.exportarExcelReporteValorizado);

router.get("/produccion/reportes/categorias", auth.authProduccion, panelControllers.reportePlantaCategorias);

router.get("/produccion/reportes/categorias/nueva", auth.authProduccion, panelControllers.reportePlantaCategoriasNueva);

router.post("/produccion/reportes/categorias/nueva", auth.authProduccion, validar.validarCategoriaReporteChain, panelControllers.reportePlantaCategoriasInsert);

router.get("/produccion/reportes/categorias/editar", auth.authProduccion, panelControllers.reportePlantaCategoriasEditar);

router.post("/produccion/reportes/categorias/editar", auth.authProduccion, panelControllers.reportePlantaCategoriasUpdate);

router.get("/produccion/reportes/categorias/eliminar", auth.authProduccion, panelControllers.reportePlantaCategoriasEliminar);

router.get("/produccion/personalizado/nuevo", auth.authProduccion, panelControllers.pedidoProduccionPersonalizadoNuevo);

router.post("/produccion/personalizado/nuevo", auth.authProduccion, validar.validarStringsChain, panelControllers.pedidoProduccionPersonalizadoCrear);

router.get("/productosFabrica", auth.authProduccion, panelControllers.productosFabrica);

router.get("/productosFabrica/nuevo", auth.authProduccion, panelControllers.productosFabricaNuevo);

router.post("/productosFabrica/nuevo", auth.authProduccion, validar.validarProductoFabricaChain, panelControllers.productosFabricaInsert);

router.get("/productosFabrica/editar", auth.authProduccion, panelControllers.productosFabricaEditar);

router.post("/productosFabrica/editar", auth.authProduccion, validar.validarProductoFabricaChain, panelControllers.productosFabricaUpdate);

router.get("/productosFabrica/eliminar", auth.authProduccion, panelControllers.productosFabricaEliminar);

router.get("/categoriasFabrica", auth.authProduccion, panelControllers.categoriasFabrica);

router.get("/categoriasFabrica/nueva", auth.authProduccion, panelControllers.categoriasFabricaNueva);

router.post("/categoriasFabrica/nueva", auth.authProduccion, validar.validarCategoriaFabricaChain, panelControllers.categoriasFabricaInsert);

router.get("/categoriasFabrica/editar", auth.authProduccion, panelControllers.categoriasFabricaEditar);

router.post("/categoriasFabrica/editar", auth.authProduccion, validar.validarCategoriaFabricaChain, panelControllers.categoriasFabricaUpdate);

router.get("/categoriasFabrica/eliminar", auth.authProduccion, panelControllers.categoriasFabricaEliminar);

router.get("/productosFabrica/fotos", auth.authProduccion, panelControllers.fotosProductosFabrica);

router.get("/productosFabrica/fotos/nueva", auth.authProduccion, panelControllers.nuevaFotoProductoFabrica);

router.post("/productosFabrica/fotos/nueva", auth.authProduccion, fileUpload.subirArchivo.single("foto"), panelControllers.uploadNuevaFotoProductoFabrica);

router.get("/productosFabrica/precios", auth.authProduccion, panelControllers.preciosProductosFabrica);

router.post("/productosFabrica/precios", auth.authProduccion, validar.validarPreciosChain, panelControllers.preciosProductosFabricaUpdate);

router.get("/servicios", auth.authSupervisor, panelControllers.servicios);

router.get("/servicios/nuevo", auth.authSupervisor, panelControllers.servicioNuevo);

router.post("/servicios/nuevo", auth.authSupervisor, validar.validarStringsChain, panelControllers.servicioInsert);

router.get("/servicios/eliminar", auth.authSupervisor, panelControllers.servicioEliminar);

router.get("/facturacion", auth.authAtencion, panelControllers.facturacion);

router.post("/facturacion", auth.authAtencion, validar.validarFacturacionChain, panelControllers.facturacionPost);

router.post("/facturacion/padron/api", auth.authAtencion, panelControllers.facturacionConsultaPadron);

router.get("/facturacion/nc", auth.authAtencion, panelControllers.facturacionNC);

router.get("/facturacion/comprobante", auth.authAtencion, panelControllers.facturacionComprobante);

router.get("/facturacion/comprobante/parcial", auth.authAtencion, panelControllers.facturacionComprobanteParcial);

router.get("/facturacion/comprobante/fiscal", auth.authAtencion, panelControllers.facturacionComprobanteFiscal);

router.get("/facturacion/registros", auth.authAtencion, panelControllers.facturacionRegistros);

router.get("/facturacion/registros/senias", auth.authAtencion, panelControllers.facturacionRegistrosSenias);

router.get("/facturacion/registros/senias/actualizar", auth.authAtencion, panelControllers.facturacionSeniasActualizarEstado);

router.get("/facturacion/registros/gastos", auth.authAdmin, panelControllers.gastosLocal);

router.post("/facturacion/registros/gastos/nuevo", auth.authAtencion, validar.validarGastosChain, panelControllers.gastosLocalInsert);

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

router.get("/local/caja/cierre", auth.authAtencion, panelControllers.localCierreDeCaja);

router.get("/local/caja/cierre/abrir", auth.authAtencion, panelControllers.localCierreDeCajaApertura);

router.post("/local/caja/cierre/abrir", auth.authAtencion, validar.validarCajaChain, panelControllers.localCierreDeCajaAperturaInsert);

router.get("/local/caja/cierre/cerrar", auth.authAtencion, panelControllers.localCierreDeCajaCerrar);

router.post("/local/caja/cierre/cerrar", auth.authAtencion, validar.validarCajaChain, panelControllers.localCierreDeCajaCerrarInsert);

router.post("/local/caja/api", auth.authAtencion, panelControllers.localCierreDeCajaApi);

router.get("/local/caja/reporte", auth.authAtencion, panelControllers.localCierreDeCajaReporte);

router.post("/local/caja/reporte/excel", auth.authAdmin, excelControllers.exportarExcelReporteCaja);

module.exports = router;