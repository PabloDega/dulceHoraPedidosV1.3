const { conectar } = require(__basedir + "/src/config/dbConnection");

const getPedidos = async(local) => {
  try {
    const rows  = await conectar.query('SELECT * FROM pedidos WHERE ?', { local });
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getPedido = async(id) => {
  try {
    let rows  = await conectar.query('SELECT * FROM pedidos WHERE ?', { id });
    if(rows[0][0].estado == "nuevo"){
      await conectar.query('UPDATE pedidos SET estado = "leido", buzon = "vacio" WHERE ?', { id });
    } else {
      await conectar.query('UPDATE pedidos SET buzon = "vacio" WHERE ?', { id });
    }
    return rows[0][0];
  } catch (error) {
    let data = {
      local: "x",
    }
    return data
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateEstadoPedidos = async(id, estado) => {
  try {
    await conectar.query(`UPDATE pedidos SET estado = "${estado}" WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
  getPedidos,
  getPedido,
  updateEstadoPedidos,
}