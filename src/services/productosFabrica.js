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
    return productosConPrecio[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertProductoFabrica = async (datos) => {
  try {
    let productoInsert = await conectar.query(`INSERT INTO productosfabrica (categoria, nombre, estado, descripcion, sector, unidad, codigo, img) VALUES ("${datos.categoria}", "${datos.nombre}", "${datos.estado || 'false'}", "${datos.descripcion || ''}", "${datos.sector}", "${datos.unidad}", "${datos.codigo}", "im/fabrica/${datos.codigo}.png")`);

    await conectar.query(`INSERT INTO listasdepreciosfabrica (idRef, codigo, lista1) VALUES (${productoInsert[0].insertId}, "${datos.codigo}", "${datos.costo}")`);

  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateProductoFabrica = async (datos, id) => {
  try {
    await conectar.query(`UPDATE productosfabrica SET categoria = "${datos.categoria}", nombre = "${datos.nombre}", estado = "${datos.estado || 'false'}", descripcion = "${datos.descripcion}", sector = "${datos.sector}", unidad = "${datos.unidad}", codigo = "${datos.codigo}", img = "im/fabrica/${datos.codigo}.png" WHERE id = "${id}"`);

    let lista = "lista1";
    if(datos.lista){lista = `lista${datos.lista}`;}
    await conectar.query(`UPDATE listasdepreciosfabrica SET ${lista} = "${datos.costo}" WHERE idRef = "${id}"`)

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

const updatePreciosProductosFabrica = async (precios, lista) => {
  try {
    for(id in precios){
      if(precios[id] > 0){
        const check = await conectar.query(`SELECT * FROM listasdepreciosfabrica WHERE idRef = "${id}"`);
        if(check[0].length < 1){
          let producto = await conectar.query(`SELECT * FROM productosfabrica WHERE id = "${id}"`);
          await conectar.query(`INSERT INTO listasdepreciosfabrica (idRef, codigo) VALUES ("${id}", "${producto[0][0].codigo}")`);  
        }
        await conectar.query(`UPDATE listasdepreciosfabrica SET ${lista} = "${precios[id]}" WHERE idRef = "${id}"`);
      }
    }
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const getColumnasPreciosFabrica = async () => {
  try {
    let columnas = await conectar.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='listasdepreciosfabrica'`);
    columnas = await productosMiddleware.parseColumnas(columnas);
    return columnas;
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
  getColumnasPreciosFabrica,
};
