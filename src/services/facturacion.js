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

const getFacturasNF = async(local, tipo) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM facturacionnf WHERE local = '${local}' AND tipo = '${tipo}'`);
    return facturas[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const getFacturasNFTodas = async() => {
  try {
    const facturas = await conectar.query(`SELECT * FROM facturacionnf`);
    return facturas[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const getFacturasNFxfecha = async(local, fecha) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM facturacionnf WHERE local = '${local}' AND fecha = '${fecha}'`);
    return facturas[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const getSenias = async(local) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM facturacionnf WHERE local = '${local}' AND tipo = 'S' ORDER BY id DESC`);
    return facturas[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const getSenia = async(local, id) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM facturacionnf WHERE local = '${local}' AND tipo = 'S' AND id = '${id}'`);
    return facturas[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const updateSenias = async (id, observaciones) => {
  try {
    await conectar.query(`UPDATE facturacionnf SET observaciones = '${observaciones}' WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getFacturaNF = async(id) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM facturacionnf WHERE id = '${id}'`);
    return facturas[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const insertFacturaNF = async (local, datos, numeracion) => {
  try {
    const obs = {} 
    if(datos.senia > 0){
      obs.nombre = datos.nombreSenia,
      obs.estadoSenia = "pendiente";
    }
    const insert = await conectar.query(`INSERT INTO facturacionnf (cuitemisor, local, numero, fecha, tipo, formaPago, detalle, neto, iva10, iva21, total, senia, observaciones) VALUES ("${local.cuit}", "${local.id}", "${numeracion}", "${datos.fecha}", "${datos.tipo}", "${datos.formaDePago}", "${datos.datos}", "${datos.neto}", "${datos.iva10}", "${datos.iva21}", "${datos.total}", "${datos.senia}", '${JSON.stringify(obs)}')`);
    return  insert[0].insertId;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getFacturasCAExfecha = async(local, fecha) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM registrosWSFE WHERE local = '${local}' AND fecha = '${fecha}'`);
    return facturas[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const insertFacturaConCAE = async (CAERaw, datos, body) => {
  let CAE = CAERaw["respuesta"]["FECAESolicitarResult"]["FeDetResp"]["FECAEDetResponse"][0];
  try {
    const insert = await conectar.query(`INSERT INTO registrosWSFE (cuitemisor, ptoventa, receptor, local, numero, fecha, tipo, formaPago, detalle, neto, baseiva10, iva10, baseiva21, iva21, total, CAE) VALUES ("${datos.cuit}", "${datos.punto}", "${datos.cuitR}", "${datos.local}", "${CAE.CbteDesde}", "${body.fecha}", "${datos.tipo}", "${body.formaDePago}", "${body.datos}", "${datos.neto}", "${datos.baseiva10}", "${datos.iva10}", "${datos.baseiva21}", "${datos.iva21}", "${datos.total}", "${CAE.CAE}")`);
    return  insert[0].insertId;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
  getBotonesFacturacion,
  getBotonesFacturacionTodos,
  getBotonFacturacion,
  insertBotonFacturacion,
  updateBotonFacturacion,
  deleteBotonFacturacion,
  getFacturasNF,
  getFacturasNFTodas,
  getFacturaNF,
  getFacturasNFxfecha,
  insertFacturaNF,
  getSenias,
  getSenia,
  updateSenias,
  getFacturasCAExfecha,
  insertFacturaConCAE,
};
