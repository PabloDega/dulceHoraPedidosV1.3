const { conectar } = require(__basedir + "/src/config/dbConnection");

const getActividad = async(local, page) => {
    try {
      const filasTotal  = await conectar.query('SELECT * FROM actividad WHERE ?', { local });
      let offset = (page * 25) - 25;
      const rows  = await conectar.query(`SELECT * FROM actividad WHERE local = ${local} ORDER BY id DESC LIMIT 25 OFFSET ${offset}`);
      return {
        data: rows[0],
        filasTotal: filasTotal[0].length
      };
    } catch (error) {
      throw error;
    } finally {
      conectar.releaseConnection();
    }
  };

  const getActividadAll = async(page, filtro) => {
    try {
      const actividadFull  = await conectar.query(`SELECT * FROM actividad`);
      let offset = (page * 25) - 25;
      const actividadOffset  = await conectar.query(`SELECT * FROM actividad ${filtro} ORDER BY id DESC LIMIT 25 OFFSET ${offset}`);
      return {
        actividad: actividadOffset[0],
        filasTotal: actividadFull[0].length,
        actividadFull: actividadFull[0],
      };
    } catch (error) {
      throw error;
    } finally {
      conectar.releaseConnection();
    }
  };

  const insertActividad = async (local, pedido, user, accion, datos) => {
    try {
      fecha = Date.now();
      await conectar.query(
        `INSERT INTO actividad (local, pedido, user, accion, datos) VALUES ("${local}", "${pedido}", "${user}", "${accion}", "${datos}")`
      );
    } catch (error) {
      throw error;
    } finally {
      conectar.releaseConnection();
    }
  };

  module.exports = {
    getActividad,
    getActividadAll,
    insertActividad,
  }