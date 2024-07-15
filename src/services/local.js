const fs = require("fs");
const { conectar } = require(__basedir + "/src/config/dbConnection");

const getLocales = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM locales WHERE visible = 'true'");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getLocalesHistoricos = async () => {
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
    const rows = await conectar.query("SELECT id, nombre, direccion, gmap FROM locales WHERE estado = 'true'");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertLocal = async(datos, serviciosActivos) => {
  try {
    await conectar.query(`INSERT INTO locales (franquicia, nombre, direccion, telefono, img, gmap, estado, linkmp, entrega, servicios) VALUES ("${datos.franquicia}", "${datos.nombre}", "${datos.direccion}", "${datos.telefono}", "${datos.img}", "${datos.gmap}", "true", "${datos.linkmp}", "[1]", '${serviciosActivos}')`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const updateLocal = async(datos, serviciosActivos, diasEntrega, listas) => {
  try {
    if(listas === undefined){listas = `["lista1"]`};
    if(datos.lista === undefined){datos.lista = 1};
    await conectar.query(`UPDATE locales SET franquicia =  "${datos.franquicia}", nombre = "${datos.nombre}", direccion = "${datos.direccion}", telefono = "${datos.telefono}", img = "${datos.img}", gmap = "${datos.gmap}", estado = "${datos.estado}", linkmp = "${datos.linkmp}", servicios = '${serviciosActivos}', entrega = "${diasEntrega}", listaprimaria = "lista${datos.lista}", listasdisponibles = '${listas}', listacostosprimaria = "lista${datos.listaCostos}" WHERE id = "${datos.id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const deleteLocal = async(id) => {
  try {
    // await conectar.query(`DELETE FROM locales WHERE id = "${id}"`);
    await conectar.query(`UPDATE locales SET visible = 'false' WHERE id = '${id}'`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

/* const updateStock = async(datos, local) => {
  try {
    await conectar.query(`UPDATE locales SET stock = "${datos}" WHERE id = "${local}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}; */

const getDatosFiscales = async (id) => {
  try {
    const datos = await conectar.query(`SELECT * FROM localesinfofiscal WHERE local = "${ id }"`);
    return datos[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertDatosFiscales = async(datos) => {
  try {
    const registro = await conectar.query(`SELECT * FROM localesinfofiscal WHERE local = "${datos.local}"`);
    if(registro[0][0] === undefined){
      await conectar.query(`INSERT INTO localesinfofiscal (local, ptoventa, cuit, razonsocial, iibb, domiciliofiscal, inicioactividades, condicioniva) VALUES ("${datos.local}", "${datos.ptoventa}", "${datos.cuit}", "${datos.razonsocial}", "${datos.iibb}", "${datos.domiciliofiscal}", "${datos.inicioactividades}", "${datos.impuestos}")`);
    } else {
      await conectar.query(`UPDATE localesinfofiscal SET local = "${datos.local}", ptoventa = "${datos.ptoventa}", cuit = "${datos.cuit}", razonsocial = "${datos.razonsocial}", iibb = "${datos.iibb}", domiciliofiscal = "${datos.domiciliofiscal}", inicioactividades = "${datos.inicioactividades}", condicioniva = "${datos.impuestos}" WHERE local = "${datos.local}"`);
    }
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

module.exports = {
  getLocales,
  getLocalesHistoricos,
  getLocal,
  getLocalesFront,
  insertLocal,
  updateLocal,
  deleteLocal,
  // updateStock,
  getDatosFiscales,
  insertDatosFiscales,
};
