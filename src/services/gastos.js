const { conectar } = require(__basedir + "/src/config/dbConnection");

const getGastos = async (local) => {
  try {
    const resultado = await conectar.query(`SELECT * FROM gastos WHERE local = '${local}'`);
    return resultado[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getGastosFecha = async (local, fecha) => {
  try {
    const resultado = await conectar.query(`SELECT * FROM gastos WHERE local = '${local}' AND fecha = '${fecha}'`);
    return resultado[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getGastosxEvento = async (local, fecha) => {
  try {
    const resultado = await conectar.query(`SELECT * FROM gastos WHERE local = '${local}' AND evento > '${fecha}'`);
    return resultado[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getGastosId = async (local, idInicio) => {
  try {
    const resultado = await conectar.query(`SELECT * FROM gastos WHERE local = '${local}' AND id > '${idInicio}'`);
    return resultado[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertGasto = async (datos) => {
  try {
    const resultado = await conectar.query(`INSERT INTO gastos (fecha, local, usuario, movimiento, monto, detalles) VALUES ("${datos.fecha}", "${datos.local}", "${datos.usuario}", "${datos.movimiento}", "${datos.monto}", "${datos.detalles}")`);
    return resultado[0]
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
    getGastos,
    getGastosFecha,
    getGastosxEvento,
    insertGasto,
    getGastosId,
}