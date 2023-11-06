const { conectar } = require(__basedir + "/src/config/dbConnection");

const getActividad = async(local, page) => {
    try {
      const filasTotal  = await conectar.query('SELECT * FROM actividad WHERE ?', { local });
      let offset = (page * 25) - 25;
      const rows  = await conectar.query(`SELECT * FROM actividad WHERE local = ${local} LIMIT 25 OFFSET ${offset}`);
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

  const getActividadAll = async(page) => {
    try {
      const filasTotal  = await conectar.query(`SELECT * FROM actividad`);
      let offset = (page * 25) - 25;
      const rows  = await conectar.query(`SELECT * FROM actividad LIMIT 25 OFFSET ${offset}`);
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

  module.exports = {
    getActividad,
    getActividadAll,
  }