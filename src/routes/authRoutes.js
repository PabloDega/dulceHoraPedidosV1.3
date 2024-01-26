const express = require("express");
const router = express.Router();
const validar = require("../middlewares/validador");
const { isLogged } = require("../middlewares/auth");
const actividad = require(__basedir + "/src/middlewares/actividad");
const servicesChat = require(__basedir + "/src/services/chat");
const limiter = require("../middlewares/limiter");
const authControllers = require("../controllers/authControllers");

router.get("/", limiter.limiterGeneral, isLogged, authControllers.loginForm);

router.post("/", validar.validarLoginChain, authControllers.loginQuery);

router.get("/logout", limiter.limiterGeneral, async(req, res) => {
    servicesChat.chatLocalActivoSub(req.session.userLocal);
    // await actividad.actividadUser(req.session.userLog, req.session.userLocal, 0, "Logout", "")
    req.session = null;
    res.redirect("/login");
})

module.exports = router;