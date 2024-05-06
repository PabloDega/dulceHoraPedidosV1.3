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

module.exports = {
  getCierres,
};
