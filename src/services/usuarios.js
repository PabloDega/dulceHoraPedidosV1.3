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

const getUsuario = async(id) => {
  try {
    const rows  = await conectar.query('SELECT * FROM usuarios WHERE ?', { id });
    return rows[0][0];
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertUsuario = async(datos) => {
  try {
    await conectar.query(`INSERT INTO usuarios (usuario, pass, rol, local) VALUES ("${datos.usuario}", "${datos.passHash}", "${datos.rolUser}", "${datos.local}")`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const updateUsuario = async(datos) => {
  try {
    if(datos.passHash){
      await conectar.query(`UPDATE usuarios SET rol = "${datos.rolUser}", pass = "${datos.passHash}" WHERE id = "${datos.id}"`);
    } else {
      await conectar.query(`UPDATE usuarios SET rol = "${datos.rolUser}" WHERE id = "${datos.id}"`);
    }
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const deleteUsuario = async(id) => {
  try {
    await conectar.query(`DELETE FROM usuarios WHERE id = "${id}"`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const getUsuariosLocal = async(local) => {
  try {
    const usuarios  = await conectar.query(`SELECT * FROM usuarios WHERE local = "${local}"`);
    return usuarios[0];
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
  getUsuariosLocal,
}