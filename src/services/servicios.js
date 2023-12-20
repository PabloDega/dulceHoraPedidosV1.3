const { conectar } = require(__basedir + "/src/config/dbConnection");

const getServicios = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM servicios");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertServicio = async (datos) => {
  try {
    await conectar.query(`INSERT INTO servicios (servicio) VALUES ("${datos.servicio}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteServicio = async (id) => {
  try {
    await conectar.query(`DELETE FROM servicios WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
  getServicios,
  deleteServicio,
  insertServicio,
};
