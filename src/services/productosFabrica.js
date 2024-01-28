const { conectar } = require(__basedir + "/src/config/dbConnection");

const getProductosFabrica = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM productosfabrica WHERE visible = 'true' ORDER BY codigo");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductosFabricaActivos = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM productosfabrica WHERE estado = 'true' AND visible = 'true' ORDER BY codigo");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductosFabricaHistoricos = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM productosfabrica ORDER BY codigo");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductoFabrica = async (id) => {
  try {
    const rows = await conectar.query("SELECT * FROM productosfabrica WHERE ?", { id });
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertProductoFabrica = async (datos) => {
  try {
    await conectar.query(`INSERT INTO productosfabrica (categoria, nombre, costo, estado, descripcion, sector, unidad, codigo, img) VALUES ("${datos.categoria}", "${datos.nombre}", "${datos.costo}", "${datos.estado || 'false'}", "${datos.descripcion || ''}", "${datos.sector}", "${datos.unidad}", "${datos.codigo}", "im/fabrica/${datos.codigo}.png")`);  
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateProductoFabrica = async (datos, id) => {
  try {
    await conectar.query(`UPDATE productosfabrica SET categoria = "${datos.categoria}", nombre = "${datos.nombre}", costo = "${datos.costo}", estado = "${datos.estado || 'false'}", descripcion = "${datos.descripcion}", sector = "${datos.sector}", unidad = "${datos.unidad}", codigo = "${datos.codigo}", img = "im/fabrica/${datos.codigo}.png" WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const deleteProductoFabrica = async (id) => {
  try {
    await conectar.query(`UPDATE productosfabrica SET visible = 'false' WHERE id = '${id}'`);
    // await conectar.query(`DELETE FROM productosfabrica WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getSectoresFabrica = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM sectoresfabrica");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getCategoriasFabrica = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM categoriasfabrica ORDER BY categoriaProduccion");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getCategoriaFabrica = async (id) => {
  try {
    const rows = await conectar.query("SELECT * FROM categoriasfabrica WHERE ?", { id });
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertCategoriaFabrica = async (datos) => {
  try {
    await conectar.query(`INSERT INTO categoriasfabrica (categoriaProduccion, color) VALUES ("${datos.categoria}", "${datos.color}")`);  
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateCategoriaFabrica = async (datos, id) => {
  try {
    await conectar.query(`UPDATE categoriasfabrica SET categoriaProduccion = "${datos.categoria}", color = "${datos.color}" WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const deleteCategoriaFabrica = async (id) => {
  try {
    await conectar.query(`DELETE FROM categoriasfabrica WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updatePreciosProductosFabrica = async (precios) => {
  try {
    for(id in precios){
      if(precios[id] > 0){
        await conectar.query(`UPDATE productosfabrica SET costo = "${precios[id]}" WHERE id = "${id}"`);
      }
    }
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

module.exports = {
  getProductosFabrica,
  getProductosFabricaActivos,
  getProductosFabricaHistoricos,
  getProductoFabrica,
  insertProductoFabrica,
  updateProductoFabrica,
  deleteProductoFabrica,
  getCategoriasFabrica,
  getCategoriaFabrica,
  insertCategoriaFabrica,
  updateCategoriaFabrica,
  deleteCategoriaFabrica,
  getSectoresFabrica,
  updatePreciosProductosFabrica,
};
