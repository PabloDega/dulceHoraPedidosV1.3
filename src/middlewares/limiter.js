const rateLimiter = require("express-rate-limit");

const limiterGeneral = rateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 70,
    message: "Demasiados intentos, por favor vuelva a intentarlo mas tarde",
})

const limiterAPI = rateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: "Demasiados intentos, por favor vuelva a intentarlo mas tarde",
})

const limiterLogin = rateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: "Demasiados intentos, por favor vuelva a intentarlo mas tarde",
})

module.exports = {
    limiterGeneral,
    limiterAPI,
    limiterLogin,
}