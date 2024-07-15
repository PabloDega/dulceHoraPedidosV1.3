const { conectar } = require(__basedir + "/src/config/dbConnection");
const productosMiddleware = require(__basedir + "/src/middlewares/productos");


const getProductosFabrica = async (lista) => {
  try {
    if(lista === undefined){
      lista = "lista1";
    }
    const productos = await conectar.query("SELECT * FROM productosfabrica WHERE visible = 'true' ORDER BY codigo");
    const precios = await conectar.query("SELECT * FROM listasdepreciosfabrica");
    const productosConPrecio = await productosMiddleware.cargarPreciosFabrica(productos[0], precios[0], lista);
    return productosConPrecio;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductosFabricaActivos = async (lista) => {
  try {
    if(lista === undefined){
      lista = "lista1";
    }
    const productos = await conectar.query("SELECT * FROM productosfabrica WHERE estado = 'true' AND visible = 'true' ORDER BY codigo");
    const precios = await conectar.query("SELECT * FROM listasdepreciosfabrica");
    const productosConPrecio = await productosMiddleware.cargarPreciosFabrica(productos[0], precios[0], lista);
    return productosConPrecio;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductosFabricaHistoricos = async (lista) => {
  try {
    const productos = await conectar.query("SELECT * FROM productosfabrica ORDER BY codigo");
    const precios = await conectar.query("SELECT * FROM listasdepreciosfabrica");
    const productosConPrecio = await productosMiddleware.cargarPreciosFabrica(productos[0], precios[0], lista);
    return productosConPrecio;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductoFabrica = async (id, lista) => {
  try {
    const productos = await conectar.query("SELECT * FROM productosfabrica WHERE ?", { id });
    const precios = await conectar.query("SELECT * FROM listasdepreciosfabrica");
    const productosConPrecio = await productosMiddleware.cargarPreciosFabrica(productos[0], precios[0], lista);
    return productosConPrecio;
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
    const rows = await conectar.query("SELECT * FROM categoriasfabrica ORDER BY orden");
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
    await conectar.query(`INSERT INTO categoriasfabrica (categoriaProduccion, color, minimo, orden) VALUES ("${datos.categoria}", "${datos.color}", "${datos.minimo}", "${datos.orden}")`);  
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};


const updateCategoriaFabrica = async (datos, id) => {
  try {
    await conectar.query(`UPDATE categoriasfabrica SET categoriaProduccion = "${datos.categoria}", color = "${datos.color}", minimo = "${datos.minimo}", orden = "${datos.orden}" WHERE id = "${id}"`);
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
