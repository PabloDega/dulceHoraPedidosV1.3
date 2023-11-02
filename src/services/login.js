const { conectar } = require(__basedir + "/src/config/dbConnection");
var bcrypt = require('bcryptjs');

async function login(usuario, pass) {
  try {
    const rows = await conectar.query("SELECT * FROM usuarios WHERE ?", { usuario });
    const data = rows[0][0];
    if(data === undefined){
      throw Error("Usuario inexistente")
    }
    const rol = data.rol;
    const local = data.local;
    if (await bcrypt.compare(pass, data.pass)) {
      return {check: true, rol, local};
    } else {
      throw Error("Password incorrecto");
    }
  } catch (error) {
    return {check: false, error};
  }
}

module.exports = { login };
