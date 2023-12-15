const { conectar } = require(__basedir + "/src/config/dbConnection");

const getReportes = async (fechas) => {
  try {
    let pedidos = {}
    for(let fecha of fechas){
        const info = await conectar.query(`SELECT * FROM produccion WHERE fechaentrega = '${fecha}'`);
        pedidos[fecha] = info[0];
    }
    // console.log(pedidos);
    return pedidos;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
    getReportes,
}