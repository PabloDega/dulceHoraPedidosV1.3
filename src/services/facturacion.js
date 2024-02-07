const { conectar } = require(__basedir + "/src/config/dbConnection");

const getBotonesFacturacion = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM botonesfacturacion WHERE estado = 'true' ORDER BY orden");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getBotonesFacturacionTodos = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM botonesfacturacion ORDER BY orden");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getBotonFacturacion = async (id) => {
  try {
    const rows = await conectar.query(`SELECT * FROM botonesfacturacion WHERE id = '${id}'`);
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertBotonFacturacion = async (datos) => {
  try {
    await conectar.query(`INSERT INTO botonesfacturacion (codigo, detalle, cantidad, orden, estado) VALUES ("${datos.codigo}", "${datos.detalle}", "${datos.cantidad}", "${datos.orden}", "${datos.estado || "false"}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateBotonFacturacion = async (datos) => {
  try {
    await conectar.query(`UPDATE botonesfacturacion SET codigo = "${datos.codigo}", detalle = "${datos.detalle}", cantidad = "${datos.cantidad}", orden = "${datos.orden}", estado = "${datos.estado}" WHERE id = "${datos.id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteBotonFacturacion = async(id) => {
  try {
    await conectar.query(`DELETE FROM botonesfacturacion WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

module.exports = {
  getBotonesFacturacion,
  getBotonesFacturacionTodos,
  getBotonFacturacion,
  insertBotonFacturacion,
  updateBotonFacturacion,
  deleteBotonFacturacion,
};
