const isNotLogged = (req, res, next) => {
  if (!req.session.userLog) {
    return res.redirect("/login");
  }
  next();
};

const isLogged = (req, res, next) => {
  if (req.session.userLog) {
    return res.redirect("/panel");
  }
  next();
};

const authAdmin = (req, res, next) => {
  if (req.session.userRol == "admin" || req.session.userRol == "supervisor") {
    next();
  } else {
  return res.redirect("/panel");
  }
};

const authSupervisor = (req, res, next) => {
  if (req.session.userRol != "supervisor") {
    return res.redirect("/panel");
  }
  next();
};

module.exports = { 
  isNotLogged,
  isLogged,
  authAdmin,
  authSupervisor,
};
