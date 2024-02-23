const { conectar } = require(__basedir + "/src/config/dbConnection");

const getReportes = async (fecha) => {
  try {
    const info = await conectar.query(`SELECT * FROM produccion WHERE fechaentrega = '${fecha}'`);
    return info[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getCategoriasReporte = async () => {
  try {
    const info = await conectar.query(`SELECT * FROM categoriasreporteplanta`);
    return info[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertCategoriasReporte = async (datos) => {
  try {
    await conectar.query(`INSERT INTO categoriasreporteplanta (categoria, productos, seccion, orden) VALUES ("${datos.categoria}", "${datos.productos}", "${datos.seccion}", "${datos.orden}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
    getReportes,
    getCategoriasReporte,
    insertCategoriasReporte,
}