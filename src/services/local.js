const fs = require("fs");
const { conectar } = require(__basedir + "/src/config/dbConnection");

const getLocales = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM locales");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getLocal = async (id) => {
  try {
    const rows = await conectar.query("SELECT * FROM locales WHERE ?", { id });
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getLocalesFront = async () => {
  try {
    const rows = await conectar.query("SELECT id, nombre, direccion, gmap FROM locales WHERE estado = 'activo'");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertLocal = async(datos, diasEntrega, serviciosActivos) => {
  try {
    await conectar.query(`INSERT INTO locales (franquicia, nombre, direccion, telefono, img, gmap, promobp, stock, estado, linkmp, entrega, servicios) VALUES ("${datos.franquicia}", "${datos.nombre}", "${datos.direccion}", "${datos.telefono}", "${datos.img}", "${datos.gmap}", "${datos.promobp}", "1", "activo", "${datos.linkmp}", "${diasEntrega}", '${serviciosActivos}')`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const updateLocal = async(datos, serviciosActivos, diasEntrega) => {
  try {
    await conectar.query(`UPDATE locales SET franquicia =  "${datos.franquicia}", nombre = "${datos.nombre}", direccion = "${datos.direccion}", telefono = "${datos.telefono}", img = "${datos.img}", gmap = "${datos.gmap}", promobp = "${datos.promobp || "false"}", estado = "${datos.estado}", linkmp = "${datos.linkmp}", servicios = '${serviciosActivos}', entrega = "${diasEntrega}" WHERE id = "${datos.id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const deleteLocal = async(id) => {
  try {
    await conectar.query(`DELETE FROM locales WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const updateStock = async(datos, local) => {
  try {
    await conectar.query(`UPDATE locales SET stock = "${datos.stock}" WHERE id = "${local}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
  getLocales,
  getLocal,
  getLocalesFront,
  insertLocal,
  updateLocal,
  deleteLocal,
  updateStock,
};
