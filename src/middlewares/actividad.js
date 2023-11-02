const { conectar } = require(__basedir + "/src/config/dbConnection");

const actividadUser = async (user, local, pedido, accion, datos) => {
  try {
    fecha = Date.now();
    await conectar.query(
      `INSERT INTO actividad (local, fecha, pedido, user, accion, datos) VALUES ("${local}", "${fecha}", "${pedido}", "${user}", "${accion}", "${datos}")`
    );
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};
const actividadCliente = async (local, pedido, user, accion, datos) => {
  try {
    fecha = Date.now();
    await conectar.query(
      `INSERT INTO actividad (local, fecha, pedido, user, accion, datos) VALUES ("${local}", "${fecha}", "${pedido}", "${user}", "${accion}", "${datos}")`
    );
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
  actividadUser,
  actividadCliente,
};
