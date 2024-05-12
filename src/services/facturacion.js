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

const getFacturasNFxEvento = async(local, fecha) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM facturacionnf WHERE local = '${local}' AND fechaevento > '${fecha}'`);
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
// agregar local a updateSenias!!!
const updateSenias = async (id, observaciones) => {
  try {
    await conectar.query(`UPDATE facturacionnf SET observaciones = '${observaciones}' WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getFacturaNF = async(id, local) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM facturacionnf WHERE id = '${id}' AND local = '${local}'`);
    return facturas[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const insertFacturaNF = async (local, datos, numeracion) => {
  try {
    let obs = {} 
    if(datos.tipo == "S" && datos.senia > 0){
      obs.nombre = datos.nombreSenia,
      obs.estadoSenia = "pendiente";
    }
    if(datos.formaDePago === "multiple"){
      let pagoMultiple = JSON.parse(datos.pagoMultiple)
      obs.pagoMultiple = pagoMultiple;
    }
    // capturar NC
    if(datos.tipo == "NC"){
      obs.nc = datos.numero,
      obs.idNc = datos.id;
    }
    const insert = await conectar.query(`INSERT INTO facturacionnf (cuitemisor, local, numero, fecha, tipo, formaPago, detalle, neto, iva10, iva21, total, senia, observaciones) VALUES ("${local.cuit}", "${local.id}", "${numeracion}", "${datos.fecha}", "${datos.tipo}", "${datos.formaDePago}", "${datos.datos}", "${datos.neto}", "${datos.iva10}", "${datos.iva21}", "${datos.total}", "${datos.senia}", '${JSON.stringify(obs)}')`);
    return  insert[0].insertId;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getFacturasCAE = async(local, tipo) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM registrosWSFE WHERE local = '${local}' AND tipo = '${tipo}'`);
    return facturas[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}
// agregar local para varificar la consulta
const getFacturaCAE = async(id, local) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM registrosWSFE WHERE id = '${id}' AND local = '${local}'`);
    return facturas[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

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

const getFacturasCAExEvento = async(local, fecha) => {
  try {
    const facturas = await conectar.query(`SELECT * FROM registrosWSFE WHERE local = '${local}' AND fechaevento > '${fecha}'`);
    return facturas[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const insertFacturaConCAE = async (CAERaw, datos, body) => {
  let CAE = CAERaw["respuesta"]["FECAESolicitarResult"]["FeDetResp"]["FECAEDetResponse"][0];
  let obs = {} 
  if(datos.formaDePago === "multiple"){
    let pagoMultiple = JSON.parse(datos.pagoMultiple)
    obs.pagoMultiple = pagoMultiple;
  }
  try {
    const insert = await conectar.query(`INSERT INTO registrosWSFE (cuitemisor, ptoventa, receptor, local, numero, fecha, tipo, formaPago, detalle, neto, baseiva10, iva10, baseiva21, iva21, total, CAE, senia,  observaciones) VALUES ("${datos.cuit}", "${datos.punto}", "${datos.cuitR || 0}", "${datos.local}", "${CAE.CbteDesde}", "${body.fecha}", "${datos.tipo}", "${body.formaDePago}", "${body.datos}", "${datos.neto}", "${datos.baseiva10}", "${datos.iva10}", "${datos.baseiva21}", "${datos.iva21}", "${datos.total}", "${CAE.CAE}", "${datos.senia}", '${JSON.stringify(obs)}')`);
    return  insert[0].insertId;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertNCConCAE = async (CAERaw, datos, fecha) => {
  // console.log(fecha)
  // console.log(datos.detalle)
  let CAE = CAERaw["respuesta"]["FECAESolicitarResult"]["FeDetResp"]["FECAEDetResponse"][0];
  let obs = {} 
  // capturar NC
  if(datos.tipo == 3 || datos.tipo == 8 || datos.tipo == 13){
    obs.nc = datos.numero;
    obs.idNc = datos.id;
  }
  if(datos.formaDePago === "multiple"){
    let pagoMultiple = JSON.parse(datos.pagoMultiple)
    obs.pagoMultiple = pagoMultiple;
  }
  // console.log(obs)
  try {
    const insert = await conectar.query(`INSERT INTO registrosWSFE (cuitemisor, ptoventa, receptor, local, numero, fecha, tipo, formaPago, detalle, neto, baseiva10, iva10, baseiva21, iva21, total, CAE, senia,  observaciones) VALUES ("${datos.cuit}", "${datos.punto}", "${datos.cuitR || 0}", "${datos.local}", "${CAE.CbteDesde}", "${fecha}", "${datos.tipo}", "${datos.formaDePago}", "${datos.detalle}", "${datos.neto}", "${datos.baseiva10}", "${datos.iva10}", "${datos.baseiva21}", "${datos.iva21}", "${datos.total}", "${CAE.CAE}", "${datos.senia}", '${JSON.stringify(obs)}')`);
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
  getFacturasNFxEvento,
  insertFacturaNF,
  getSenias,
  getSenia,
  updateSenias,
  getFacturasCAE,
  getFacturaCAE,
  getFacturasCAExfecha,
  getFacturasCAExEvento,
  insertFacturaConCAE,
  insertNCConCAE,
};
