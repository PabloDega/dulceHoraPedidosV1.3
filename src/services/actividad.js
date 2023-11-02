const { conectar } = require(__basedir + "/src/config/dbConnection");

const getActividad = async(local) => {
    try {
      const rows  = await conectar.query('SELECT * FROM actividad WHERE ?', { local });
      return rows[0];
    } catch (error) {
      throw error;
    } finally {
      conectar.releaseConnection();
    }
  };

  const getActividadAll = async() => {
    try {
      const rows  = await conectar.query('SELECT * FROM actividad');
      return rows[0];
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