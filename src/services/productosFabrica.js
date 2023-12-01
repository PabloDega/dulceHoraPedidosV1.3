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

module.exports = {
  getProductosFabrica,
};
