const { query } = require("express");

const servicesProductos = require(__basedir + "/src/services/productos");
const { conectar } = require(__basedir + "/src/config/dbConnection");

const prodActivos = (data, local) => {
    let stock = local.stock.split(",")
    let prodActivos = []
    stock.forEach((prod) => {
        let busqueda = data.find((dato) => dato.id == prod);
        prodActivos.push(busqueda)
    })
    return prodActivos;
}

const categorias = async (prodActivos) => {
    let categorias = [];
    prodActivos.forEach((prod) => {
        categorias.push(prod.categoria)
    });
    let categoriasUnicas = [...new Set(categorias)];
    let data = await servicesProductos.getCategorias();
    let categoriasConImagen = []
    categoriasUnicas.forEach((categoria) => {
        let getImg = data.find((dato) => dato.categoria == categoria);
        categoriasConImagen.push({categoria, imgCat: getImg.imgCat})
    })
    return categoriasConImagen;
}

const insertPedido = async(local, productos, total) => {
    try {
      const answer = await conectar.query(`INSERT INTO pedidos (id, fecha, local, productos, total, estado, buzon, mensajes) VALUES (NULL, current_timestamp(), "${local}", "${productos}", "${total}", "nuevo", "mensaje", "")`);
      return answer[0].insertId;
    } catch (error) {
      throw error;
    } finally {
      conectar.releaseConnection();
    }
  };

module.exports = { 
    prodActivos,
    categorias,
    insertPedido,
 };
