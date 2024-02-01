const fs = require("fs");
const { conectar } = require(__basedir + "/src/config/dbConnection");

const getCategorias = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM categorias");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getCategoria = async (id) => {
  try {
    const rows = await conectar.query("SELECT * FROM categorias WHERE ?", { id });
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertCategoria = async (datos) => {
  try {
    const answer = await conectar.query(
      `INSERT INTO categorias (categoria) VALUES ("${datos.categoria}")`
    );
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateCategoria = async (datos) => {
  try {
    const answer = await conectar.query(
      `UPDATE categorias SET categoria = "${datos.categoria}" WHERE id = "${datos.id}"`
    );
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteCategoria = async (id) => {
  try {
    const answer = await conectar.query(`DELETE FROM categorias WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updatePrecios = async (objetoPrecios) => {
  try {
    for(item in objetoPrecios){
      await conectar.query(`UPDATE productoslocal SET preciounidad = "${objetoPrecios[item][0]}", preciodocena = "${objetoPrecios[item][1]}", preciokilo = "${objetoPrecios[item][2]}" WHERE id = "${item}"`);
    }
    return
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const lastId = async (tabla) => {
  const getLastId = await conectar.query(`SHOW TABLE STATUS LIKE '${tabla}'`);
  return getLastId[0][0].Auto_increment;
};

const getProductosLocal = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM productoslocal WHERE estado = 'true' ORDER BY codigo");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductosLocalTodos = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM productoslocal ORDER BY codigo");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductoLocal = async (id) => {
  try {
    const rows = await conectar.query("SELECT * FROM productoslocal WHERE ?", { id });
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertProductoLocal = async (datos) => {
  try {
    await conectar.query(`INSERT INTO productoslocal (codigo, nombre, categoria, descripcion, fraccionamiento, preciounidad, preciodocena, preciokilo, iva, img, estado) VALUES ("${datos.codigo}", "${datos.nombre}", "${datos.categoria}", "${datos.descripcion}", "${datos.fraccionamiento}", "${datos.preciounidad}", "${datos.preciodocena}", "${datos.preciokilo}", "${datos.iva}", "${datos.nombreImg}", "${datos.estado}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateProductoLocal = async (datos) => {
  try {
    const answer = await conectar.query(
      `UPDATE productoslocal SET codigo = "${datos.codigo}", nombre = "${datos.nombre}", categoria = "${datos.categoria}", descripcion = "${datos.descripcion}", fraccionamiento = "${datos.fraccionamiento}", preciounidad = "${datos.preciounidad}", preciodocena = "${datos.preciodocena}", preciokilo = "${datos.preciokilo}", iva = "${datos.iva}", img = "${datos.nombreImg}", estado = "${datos.estado || "false"}" WHERE id = "${datos.id}"`
    );
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteProductoLocal = async (id) => {
  try {
    const answer = await conectar.query(`DELETE FROM productoslocal WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
  getCategorias,
  getCategoria,
  insertCategoria,
  updateCategoria,
  deleteCategoria,
  updatePrecios,
  lastId,
  getProductosLocal,
  getProductosLocalTodos,
  getProductoLocal,
  insertProductoLocal,
  updateProductoLocal,
  deleteProductoLocal,
};
