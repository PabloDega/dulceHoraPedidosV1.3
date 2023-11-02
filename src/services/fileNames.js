const { conectar } = require(__basedir + "/src/config/dbConnection");

const buscarPathDuplicado = async(nombre, tabla, columna) => {
    try {
      const rows  = await conectar.query(`SELECT * FROM ${tabla} WHERE ${columna}="${nombre}"`);
      return rows[0][0];
    } catch (error) {
      throw error;
    } finally {
      conectar.releaseConnection();
    }
  };

  module.exports = {
    buscarPathDuplicado,
  }