const fs = require("fs");
const { conectar } = require(__basedir + "/src/config/dbConnection");

/* const getProductos = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM productos ORDER BY categoria");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProducto = async (id) => {
  try {
    const rows = await conectar.query("SELECT * FROM productos WHERE ?", { id });
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertProducto = async (datos) => {
  try {
    await conectar.query(`INSERT INTO productos (categoria, nombre, descripcion, variedad, precio, precioDocena, fraccionamiento, imgCard, estado, topSale, destacado) VALUES ("${datos.categoria}", "${datos.nombre}", "${datos.descripcion}", "${datos.variedad || datos.nombre}", "${datos.precio}", "${datos.precioDoc}", "${datos.fraccionamiento}", "${datos.nombreImg}", "${datos.estado || "false"}", "${datos.topSale || "false"}", "${datos.destacado || "false"}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateProducto = async (datos) => {
  try {
    const answer = await conectar.query(
      `UPDATE productos SET categoria = "${datos.categoria}", nombre = "${datos.nombre}", descripcion = "${datos.descripcion}", variedad = "${datos.variedad || datos.nombre}", precio = "${datos.precio}", precioDocena = "${datos.precioDoc}", fraccionamiento = "${datos.fraccionamiento}", imgCard = "${datos.nombreImg}", estado = "${datos.estado || "false"}", topSale = "${datos.topSale || "false"}", destacado = "${datos.destacado || "false"}" WHERE id = "${datos.id}"`
    );
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteProducto = async (id) => {
  try {
    await conectar.query(`DELETE FROM productos WHERE id = "${id}"`);
    // Buscar id de prod en los stock de los locales, eliminarlo y actualizar bbdd
    const stock = await conectar.query(`SELECT id, stock FROM locales`);
    stock[0].forEach(async (dato) => {
      let datoArray = dato.stock.split(",");
      let busqueda = datoArray.indexOf(id);
      if (busqueda != -1) {
        datoArray.splice(busqueda, 1);
        datoArray.toString();
        await conectar.query(`UPDATE locales SET stock = "${datoArray}" WHERE id = "${dato.id}"`);
      }
    });
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}; */

const getCategorias = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM categorias");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getCategoria = async (id) => {
  try {
    const rows = await conectar.query("SELECT * FROM categorias WHERE ?", { id });
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertCategoria = async (datos) => {
  try {
    const answer = await conectar.query(
      `INSERT INTO categorias (categoria) VALUES ("${datos.categoria}")`
    );
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateCategoria = async (datos) => {
  try {
    const answer = await conectar.query(
      `UPDATE categorias SET categoria = "${datos.categoria}" WHERE id = "${datos.id}"`
    );
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteCategoria = async (id) => {
  try {
    const answer = await conectar.query(`DELETE FROM categorias WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updatePrecios = async (objetoPrecios) => {
  try {
    for(item in objetoPrecios){
      await conectar.query(`UPDATE productoslocal SET preciounidad = "${objetoPrecios[item][0]}", preciodocena = "${objetoPrecios[item][1]}", preciokilo = "${objetoPrecios[item][2]}" WHERE id = "${item}"`);
    }
    return
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const lastId = async (tabla) => {
  const getLastId = await conectar.query(`SHOW TABLE STATUS LIKE '${tabla}'`);
  return getLastId[0][0].Auto_increment;
};

const getProductosLocal = async () => {
  try {
    const rows = await conectar.query("SELECT * FROM productoslocal WHERE estado = 'true' ORDER BY codigo");
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductoLocal = async (id) => {
  try {
    const rows = await conectar.query("SELECT * FROM productoslocal WHERE ?", { id });
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertProductoLocal = async (datos) => {
  try {
    await conectar.query(`INSERT INTO productoslocal (codigo, nombre, categoria, descripcion, fraccionamiento, preciounidad, preciodocena, preciokilo, iva, img, estado) VALUES ("${datos.codigo}", "${datos.nombre}", "${datos.categoria}", "${datos.descripcion}", "${datos.fraccionamiento}", "${datos.preciounidad}", "${datos.preciodocena}", "${datos.preciokilo}", "${datos.iva}", "${datos.nombreImg}", "${datos.estado}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateProductoLocal = async (datos) => {
  try {
    const answer = await conectar.query(
      `UPDATE productoslocal SET codigo = "${datos.codigo}", nombre = "${datos.nombre}", categoria = "${datos.categoria}", descripcion = "${datos.descripcion}", fraccionamiento = "${datos.fraccionamiento}", preciounidad = "${datos.preciounidad}", preciodocena = "${datos.preciodocena}", preciokilo = "${datos.preciokilo}", iva = "${datos.iva}", img = "${datos.nombreImg}", estado = "${datos.estado || "false"}" WHERE id = "${datos.id}"`
    );
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteProductoLocal = async (id) => {
  try {
    const answer = await conectar.query(`DELETE FROM productoslocal WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
/*   getProductos,
  getProducto,
  insertProducto,
  updateProducto,
  deleteProducto, */
  getCategorias,
  getCategoria,
  insertCategoria,
  updateCategoria,
  deleteCategoria,
  updatePrecios,
  lastId,
  getProductosLocal,
  getProductoLocal,
  insertProductoLocal,
  updateProductoLocal,
  deleteProductoLocal,
};
