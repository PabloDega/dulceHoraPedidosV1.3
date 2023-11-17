const { conectar } = require(__basedir + "/src/config/dbConnection");

const getProduccionLocal = async (local) => {
  try {
    const rows = await conectar.query("SELECT * FROM produccion WHERE ?", { local });
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProduccionFabrica = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM produccion");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProduccionPedido = async (id) => {
  try {
    const rows = await conectar.query("SELECT * FROM produccion WHERE ?", { id });
    if(rows[0][0] === undefined){
      let data = {local: "x"}
      return data
    }
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const agregarMensajeProduccion = async(id, mensajes, emisor) => {
  try {
    await conectar.query(`UPDATE produccion SET mensajes = '${mensajes}', buzon = '${emisor}' WHERE id = '${id}'`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const mensajeProduccionLeido = async(id) => {
  try {
    await conectar.query(`UPDATE produccion SET buzon = 'leido' WHERE id = '${id}'`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const getProductosProduccion = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM productosFabrica ORDER BY categoria");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
  getProduccionFabrica,
  getProduccionLocal,
  getProduccionPedido,
  agregarMensajeProduccion,
  mensajeProduccionLeido,
  getProductosProduccion,
};
