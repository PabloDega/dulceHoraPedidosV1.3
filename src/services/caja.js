const { conectar } = require(__basedir + "/src/config/dbConnection");

const getCierres = async (local) => {
  try {
    const rows = await conectar.query(`SELECT * FROM cierresdecaja WHERE local = ${local}`);
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getCierresxId = async (local, id) => {
  try {
    const rows = await conectar.query(`SELECT * FROM cierresdecaja WHERE local = ${local} AND id = ${id}`);
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertCaja = async (apertura, fecha, local, numeracion) => {
  try {
    await conectar.query(`INSERT INTO cierresdecaja (local, numero, fecha, inicio) VALUES ("${local}", "${numeracion}", "${fecha}", '${apertura}')`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
  getCierres,
  getCierresxId,
  insertCaja,
};
