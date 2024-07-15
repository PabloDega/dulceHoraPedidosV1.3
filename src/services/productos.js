const fs = require("fs");
const { conectar } = require(__basedir + "/src/config/dbConnection");
const productosMiddleware = require(__basedir + "/src/middlewares/productos");


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
      if(item == "lista"){
        return;
      }
      let precios = JSON.stringify(objetoPrecios[item]);
      // verificar que el id este definido en la tabla!!!
      // ticket - verificar utilidad de las lineas de verificacion
      const check = await conectar.query(`SELECT * FROM listasdeprecios WHERE idRef = "${item}"`);
      if(check[0].length < 1){
        let producto = await conectar.query(`SELECT * FROM productoslocal WHERE id = "${item}"`);
        await conectar.query(`INSERT INTO listasdeprecios (idRef, codigo) VALUES ("${item}", "${producto[0][0].codigo}")`);
      }
      await conectar.query(`UPDATE listasdeprecios SET ${objetoPrecios.lista} = "${precios}" WHERE idRef = "${item}"`);
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
  conectar.releaseConnection();
  return getLastId[0][0].Auto_increment;
};

const getProductosLocal = async (lista) => {
  try {
    /* const rows = await conectar.query("SELECT * FROM productoslocal WHERE estado = 'true' AND visible = 'true' ORDER BY codigo");
    return rows[0]; */
    const productos = await conectar.query("SELECT * FROM productoslocal WHERE estado = 'true' AND visible = 'true' ORDER BY codigo");
    const precios = await conectar.query("SELECT * FROM listasdeprecios");
    const productosConPrecio = await productosMiddleware.cargarPrecios(productos[0], precios[0], lista);
    return productosConPrecio;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductosLocalTodos = async (lista) => {
  try {
    /* const rows = await conectar.query("SELECT * FROM productoslocal ORDER BY codigo");
    return rows[0]; */
    const productos = await conectar.query("SELECT * FROM productoslocal ORDER BY codigo");
    const precios = await conectar.query("SELECT * FROM listasdeprecios");
    const productosConPrecio = await productosMiddleware.cargarPrecios(productos[0], precios[0], lista);
    return productosConPrecio;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductoLocal = async (id, lista) => {
  try {
    if(lista === undefined){
      lista = "lista1";
    } else {
      lista = "lista"+lista;
    }
    
    /* const rows = await conectar.query("SELECT * FROM productoslocal WHERE ?", { id });
    return rows[0][0]; */
    const productos = await conectar.query(`SELECT * FROM productoslocal WHERE id = "${id}"`);
    const precios = await conectar.query("SELECT * FROM listasdeprecios");
    const productosConPrecio = await productosMiddleware.cargarPrecios(productos[0], precios[0], lista);
    return productosConPrecio[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getColumnasPrecios = async () => {
  try {
    let columnas = await conectar.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='listasdeprecios'`);
    columnas = await productosMiddleware.parseColumnas(columnas);
    return columnas;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
}

const insertProductoLocal = async (datos) => {
  try {
    let productoInsert = await conectar.query(`INSERT INTO productoslocal (codigo, nombre, categoria, descripcion, fraccionamiento, iva, img, estado) VALUES ("${datos.codigo}", "${datos.nombre}", "${datos.categoria}", "${datos.descripcion}", "${datos.fraccionamiento}", "${datos.iva}", "${datos.nombreImg}", "${datos.estado}")`);
    // Crear array e Insertar precio en lista 1
    /* let precios = [parseFloat(datos.preciounidad), parseFloat(datos.preciodocena), parseFloat(datos.preciokilo)];
    precios = JSON.stringify(precios); */
    let precios = await productosMiddleware.parsePrecios(datos);
    await conectar.query(`INSERT INTO listasdeprecios (idRef, codigo, lista1) VALUES (${productoInsert[0].insertId}, "${datos.codigo}", "${precios}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateProductoLocal = async (datos, numeroLista) => {
  try {
    await conectar.query(`UPDATE productoslocal SET codigo = "${datos.codigo}", nombre = "${datos.nombre}", categoria = "${datos.categoria}", descripcion = "${datos.descripcion}", fraccionamiento = "${datos.fraccionamiento}", iva = "${datos.iva}", img = "${datos.nombreImg}", estado = "${datos.estado || "false"}" WHERE id = "${datos.id}"`);
    
    /* let precios = [parseFloat(datos.preciounidad), parseFloat(datos.preciodocena), parseFloat(datos.preciokilo)];
    precios = JSON.stringify(precios); */
    let precios = await productosMiddleware.parsePrecios(datos);
    let lista = "lista1";
    if(numeroLista){lista = `lista${numeroLista}`;}
    await conectar.query(`UPDATE listasdeprecios SET ${lista} = "${precios}" WHERE idRef = "${datos.id}"`);

  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteProductoLocal = async (id) => {
  try {
    // const answer = await conectar.query(`DELETE FROM productoslocal WHERE id = "${id}"`);
    await conectar.query(`UPDATE productoslocal SET visible = 'false' WHERE id = '${id}'`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductoPersonalizados = async (id, local) => {
  try {
    const rows = await conectar.query(`SELECT * FROM productospersonalizados WHERE id = "${id}" AND local = "${local}"`);
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductosPersonalizadosxLocal = async (local) => {
  try {
    const productos = await conectar.query(`SELECT * FROM productospersonalizados WHERE local = "${local}" AND visible = 'true'`);
    return productos[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getProductosPersonalizadosxLocalTodos = async (local) => {
  try {
    const productos = await conectar.query(`SELECT * FROM productospersonalizados WHERE local = "${local}"`);
    return productos[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertProductosPersonalizados = async (datos, local) => {
  try {
    await conectar.query(`INSERT INTO productospersonalizados (codigo, local, nombre, descripcion, precio, iva) VALUES ("${datos.codigo}", "${local}", "${datos.nombre}", "${datos.descripcion}", "${datos.precio}", "${datos.iva}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateProductosPersonalizados = async (datos, local) => {
  try {
    await conectar.query(`UPDATE productospersonalizados SET codigo = "${datos.codigo}", local = "${local}", nombre = "${datos.nombre}", descripcion = "${datos.descripcion}", precio = "${datos.precio}", iva = "${datos.iva}", estado = "${datos.estado || "false"}" WHERE id = "${datos.id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteProductosPersonalizados = async (id, local) => {
  try {
    await conectar.query(`UPDATE productospersonalizados SET visible = 'false' WHERE id = '${id}' AND local = '${local}'`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};


module.exports = {
  getCategorias,
  getCategoria,
  insertCategoria,
  updateCategoria,
  deleteCategoria,
  updatePrecios,
  lastId,
  getProductosLocal,
  getProductosLocalTodos,
  getProductoLocal,
  insertProductoLocal,
  updateProductoLocal,
  deleteProductoLocal,
  getProductoPersonalizados,
  getProductosPersonalizadosxLocal,
  getProductosPersonalizadosxLocalTodos,
  insertProductosPersonalizados,
  updateProductosPersonalizados,
  deleteProductosPersonalizados,
  getColumnasPrecios,
};
