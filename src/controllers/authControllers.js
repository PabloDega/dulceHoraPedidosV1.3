const servicesLogin = require(__basedir + "/src/services/login");
const { validationResult, check } = require("express-validator");
const actividad = require(__basedir + "/src/middlewares/actividad");
const servicesChat = require(__basedir + "/src/services/chat");

const loginForm = (req, res) => {
    res.render(__basedir + "/src/views/pages/login", {usuario: ""});
  };
  
const loginQuery = async (req, res) => {
  const errores = validationResult(req);
  if(!errores.isEmpty()){
    return res.render(__basedir + "/src/views/pages/login", {
      usuario: "",
      errores: errores.array({ onlyFirstError: true }),
    }); 
  };
  const checkPass = await servicesLogin.login(req.body.loginUsuario, req.body.loginPassword);
  // servicesChat.chatLocalActivoAdd(checkPass.local);
  if (checkPass.check) {
    req.session.userLog = req.body.loginUsuario;
    req.session.userRol = checkPass.rol;
    req.session.userLocal = checkPass.local;
    await actividad.actividadUser(req.body.loginUsuario, checkPass.local, 0, "Login", "");
    /* res.render(__basedir + "/src/views/pages/panel", {
      usuario: req.session.userLog, 
      userRol: checkPass.rol,
    }); */
    return res.redirect("/panel");
  } else {
    res.render(__basedir + "/src/views/pages/login", {
        usuario: "",
        errores: [{msg: checkPass.error.message}],
    });
  }
};

module.exports = { loginForm, loginQuery };