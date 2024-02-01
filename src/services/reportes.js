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

module.exports = {
    getReportes,
}