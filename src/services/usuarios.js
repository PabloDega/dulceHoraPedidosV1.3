const { conectar } = require(__basedir + "/src/config/dbConnection");

const getUsuarios = async() => {
  try {
    const rows  = await conectar.query('SELECT * FROM usuarios');
    return rows[0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getUsuario = async(usuario) => {
  try {
    const rows  = await conectar.query('SELECT * FROM usuarios WHERE ?', { usuario });
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertUsuario = async(datos) => {
  try {
    const answer = await conectar.query(`INSERT INTO usuarios (usuario, pass, rol, local) VALUES ("${datos.usuario}", "${datos.passHash}", "${datos.rolUser}", "${datos.local}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateUsuario = async(datos) => {
  try {
    const answer = await conectar.query(`UPDATE usuarios SET rol = "${datos.rolUser}", local = "${datos.local}" WHERE usuario = "${datos.usuario}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteUsuario = async(usuario) => {
  try {
    const answer = await conectar.query(`DELETE FROM usuarios WHERE usuario = "${usuario}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};


module.exports = {
  getUsuarios,
  getUsuario,
  insertUsuario,
  updateUsuario,
  deleteUsuario,
}