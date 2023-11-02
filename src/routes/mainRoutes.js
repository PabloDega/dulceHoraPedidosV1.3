const express = require("express");
const router = express.Router();

const mainControllers = require("../controllers/mainControllers");
const limiter = require("../middlewares/limiter");

router.get("/datos", limiter.limiterAPI, mainControllers.jsonProductos);

router.get("/", limiter.limiterGeneral, mainControllers.indexSelect);

router.post("/", limiter.limiterGeneral, mainControllers.index);

router.get("/volver", limiter.limiterGeneral, mainControllers.volerIndexSelect);

router.get("/pedidos", limiter.limiterGeneral, mainControllers.index);

router.get("/carrito", limiter.limiterGeneral, mainControllers.carrito);

router.post("/carrito", limiter.limiterGeneral, mainControllers.enviarPedido);

router.get("/carrito/eliminar/:item", limiter.limiterGeneral, mainControllers.carritoEliminarItem);

router.get("/carrito/vaciar", limiter.limiterGeneral, mainControllers.carritoVaciar);

router.get("/pedido", limiter.limiterGeneral, mainControllers.verPedido);

router.get("/pedido/cancelar", limiter.limiterGeneral, mainControllers.cancelarPedido);

router.get("/gracias", limiter.limiterGeneral, mainControllers.gracias);

module.exports = router;