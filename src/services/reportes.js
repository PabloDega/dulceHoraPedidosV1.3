const { conectar } = require(__basedir + "/src/config/dbConnection");

const getReportes = async (fecha) => {
  try {
    /* let pedidos = {}
    for(let fecha of fechas){
        const info = await conectar.query(`SELECT * FROM produccion WHERE fechaentrega = '${fecha}'`);
        pedidos[fecha] = info[0];
    }
    return pedidos; */
    const info = await conectar.query(`SELECT * FROM produccion WHERE fechaentrega = '${fecha}'`);
    // console.log(info[0])
    return info[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

module.exports = {
    getReportes,
}