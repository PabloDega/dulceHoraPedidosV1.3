const servicesProductos = require(__basedir + "/src/services/productos");
// const servicesProductosFabrica = require(__basedir + "/src/services/productosFabrica");
const servicesLocal = require(__basedir + "/src/services/local");
// const servicesUsuarios = require(__basedir + "/src/services/usuarios");
// const servicesActividad = require(__basedir + "/src/services/actividad");
// const servicesProduccion = require(__basedir + "/src/services/produccion");
// const servicesReportes = require(__basedir + "/src/services/reportes");
// const servicesServicios = require(__basedir + "/src/services/servicios");
const servicesFacturacion = require(__basedir + "/src/services/facturacion");
// const servicesGastos = require(__basedir + "/src/services/gastos");
// const servicesCaja = require(__basedir + "/src/services/caja");
// const { validationResult } = require("express-validator");
// const actividadMiddleware = require(__basedir + "/src/middlewares/actividad");
// const produccionMiddleware = require(__basedir + "/src/middlewares/produccion");
// const productosMiddleware = require(__basedir + "/src/middlewares/productos");
// const reportesMiddleware = require(__basedir + "/src/middlewares/reportes");
const localMiddleware = require(__basedir + "/src/middlewares/local");
const facturacionMiddleware = require(__basedir + "/src/middlewares/facturacion");
// const gastosMiddleware = require(__basedir + "/src/middlewares/gastos");
// const cajaMiddleware = require(__basedir + "/src/middlewares/caja");
// const erroresMiddleware = require(__basedir + "/src/middlewares/errores")
// const fechasMiddleware = require(__basedir + "/src/middlewares/fecha")

const estadisticasLocalVentasDiarias = async (req, res) => {
  const servicios = await localMiddleware.filtarServicios(req.session.userLocal);
  const productos = await servicesProductos.getProductosLocalTodos();
  let facturasCAE = await servicesFacturacion.getFacturasCAExLocal(req.session.userLocal);
  let facturasNF = await servicesFacturacion.getFacturasNFxLocal(req.session.userLocal);
  let facturas = facturasNF.concat(facturasCAE);
  facturas.sort((a, b) => a.fechaevento - b.fechaevento);
  const resumenVentas = await facturacionMiddleware.crearResumenFacturacionEstadisticas(facturas, productos);
  //const resumenProductos = await facturacionMiddleware.crearResumenProductosEstadisticas(facturas)

  return res.render(__basedir + "/src/views/pages/estadisticasLocalVentasDiarias", {
      usuario: req.session.userLog,
      userRol: req.session.userRol,
      servicios,
      facturas,
      resumenVentas,
      productos,
      //resumenProductos,
    });
}

const estadisticasFabrica = async (req, res) => {
  const locales = await servicesLocal.getLocalesHistoricos();
  const localesConFacturacion = await localMiddleware.localesConFacturacion(locales);
  const productos = await servicesProductos.getProductosLocalTodos();
  const statsFacturacion = await facturacionMiddleware.calcularStatsFacturacion(localesConFacturacion, productos);

  res.render(__basedir + "/src/views/pages/estadisticasFabrica", {
    locales,
    localesConFacturacion,
    statsFacturacion,
    usuario: req.session.userLog,
    userRol: req.session.userRol,
  })
}

module.exports = {
  estadisticasLocalVentasDiarias,
  estadisticasFabrica,
}