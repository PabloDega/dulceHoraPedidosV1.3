const { conectar } = require(__basedir + "/src/config/dbConnection");

const getProductosFabrica = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM productosFabrica ORDER BY codigo");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getCategoriasFabrica = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM categoriasfabrica");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getSectoresFabrica = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM sectoresfabrica");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertProductoFabrica = async (datos) => {
  try {
    await conectar.query(`INSERT INTO productosFabrica () VALUES ("${datos.destacado || "false"}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
  getProductosFabrica,
  getCategoriasFabrica,
  getSectoresFabrica,
  insertProductoFabrica,
};
