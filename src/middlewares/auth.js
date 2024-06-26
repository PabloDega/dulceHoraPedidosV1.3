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

const authAtencion = (req, res, next) => {
  if (req.session.userRol == "atencion" || req.session.userRol == "admin" || req.session.userRol == "supervisor" || req.session.userRol == "produccion") {
    next();
  } else {
  return res.redirect("/panel");
  }
};

const authAdmin = (req, res, next) => {
  if (req.session.userRol == "admin" || req.session.userRol == "supervisor" || req.session.userRol == "produccion") {
    next();
  } else {
  return res.redirect("/panel");
  }
};

const authProduccion = (req, res, next) => {
  if (req.session.userRol != "supervisor" && req.session.userRol != "produccion") {
    return res.redirect("/panel");
  }
  next();
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
  authProduccion,
  authSupervisor,
  authAtencion,
};
