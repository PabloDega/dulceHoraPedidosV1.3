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
    const rows = await conectar.query("SELECT * FROM productosFabrica WHERE estado = 'true' ORDER BY codigo");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getUltimoPedido = async (local) => {
  try {
    const rows = await conectar.query("SELECT * FROM produccion WHERE ?", { local });
    let ultimoPedido;
    // lee registros en orden descendente y verifique que no está cancelado
    for(let i = rows[0].length - 1 ; i >= 0; i--){
      if(rows[0][i].estado !== "cancelado" || rows[0][i].estado !== "precargado"){
        ultimoPedido = rows[0][i].pedido;
        break;
      }
    }
    return ultimoPedido;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const insertPedidoProduccion = async(datos) => {
  try {
    await conectar.query(`INSERT INTO produccion (local, pedido, total, estado, fechaentrega, mensajes, buzon) VALUES ("${datos.local}", "${datos.pedido}", "${datos.total}", "cargado", "${datos.fechaDeEntrega}", "[]", "leido")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const updateEstadoProduccion = async(estado, id) => {
  try {
    await conectar.query(`UPDATE produccion SET estado = "${estado}" WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

module.exports = {
  getProduccionFabrica,
  getProduccionLocal,
  getProduccionPedido,
  agregarMensajeProduccion,
  mensajeProduccionLeido,
  getProductosProduccion,
  getUltimoPedido,
  insertPedidoProduccion,
  updateEstadoProduccion,
};
