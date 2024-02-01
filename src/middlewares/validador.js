const { validationResult, body } = require("express-validator");
const fileNames = require("../services/fileNames");
const sanitizeHtml = require('sanitize-html');

const validarInput = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(422).json({ errores: errores.array() });
  }

  next();
};

const validarNuevaCategoriaChain = [
  body("id")
    .trim()
    .notEmpty().withMessage("Error en el ID, por favor recargar fomulario")
    .isNumeric().withMessage("Error en el ID, por favor recargar fomulario"),
  body("categoria")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo categoria es obligatorio")
    .isString().withMessage("La categoría solo puede contener texto"),
  /* body("nombreImg")
    .trim()
    .notEmpty().withMessage("El campo Nombre de Imagen es obligatorio")
    .isString().withMessage("Ingresar nombre de archivo válido")
    .custom(async(nombre, { req }) => {
      if (req.body.tipo == "nuevo") {
        const nombreDuplicado = await fileNames.buscarPathDuplicado(nombre,"categorias","imgCat");
        if (nombreDuplicado) {
          throw new Error("Nombre de imagen en uso");
        }
      } else if (req.body.tipo == "editar" && req.body.nombreImg != req.body.nombreImgOriginal){
        const nombreDuplicado = await fileNames.buscarPathDuplicado(nombre,"categorias","imgCat");
        if (nombreDuplicado) {
          throw new Error("Nombre de imagen en uso");
        }
      }
    }) ,*/
];

const validarProductoChain = [
  body("id")
    .trim()
    .notEmpty().withMessage("Error en el ID, por favor recargar fomulario")
    .isNumeric().withMessage("Error en el ID, por favor recargar fomulario"),
  body("codigo")
    .trim()
    .notEmpty().withMessage("Error en el codigo, por favor recargar fomulario")
    .isNumeric().withMessage("Error en el codigo, por favor recargar fomulario"),
  body("nombre")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'Nombre' es obligatorio")
    .isString().withMessage("La categoría solo puede contener texto"),
  body("categoria")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'Categoria' es obligatorio")
    .isString().withMessage("La categoría solo puede contener texto"),
  body("descripcion")
    .optional({ values: "falsy" })
    .trim()
    .escape(),
  body("fraccionamiento")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'fraccionamiento' es obligatorio")
    .isString().withMessage("El campo fraccionamiento solo puede contener texto"),
  body("preciounidad")
    .trim()
    .escape()
    .isNumeric().withMessage("El precio solo puede contener números"),
  body("preciodocena")
    .trim()
    .escape()
    .isNumeric().withMessage("El precio solo puede contener números"),
  body("preciokilo")
    .trim()
    .escape()
    .isNumeric().withMessage("El precio solo puede contener números"),
  body("iva")
    .trim()
    .escape()
    .isNumeric().withMessage("El IVA solo puede contener números"),
  body("estado")
    .trim()
    .escape()
    /* .notEmpty().withMessage("El campo 'estado' es obligatorio")
    .isString().withMessage("El campo estado solo puede contener texto") */,
  body("nombreImg")
    .trim()
    .notEmpty().withMessage("El campo Nombre de Imagen es obligatorio")
    .isString().withMessage("Ingresar nombre de archivo válido")
    /* .custom(async(nombre, { req }) => {
      if (req.body.tipo == "nuevo") {
        const nombreDuplicado = await fileNames.buscarPathDuplicado(nombre,"productos","imgCard");
        if (nombreDuplicado) {
          throw new Error("Nombre de imagen en uso");
        }
      } else if (req.body.tipo == "editar" && req.body.nombreImg != req.body.nombreImgOriginal){
        const nombreDuplicado = await fileNames.buscarPathDuplicado(nombre,"productos","imgCard");
        if (nombreDuplicado) {
          throw new Error("Nombre de imagen en uso");
        }
      }
    }) */,
];

const validarPreciosChain = [
  body("**")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isNumeric().withMessage("Los precio solo puede contener números"),
];

const validarLocalesChain = [
  body("id")
    .trim()
    .notEmpty().withMessage("Error en el ID, por favor recargar fomulario")
    .isNumeric().withMessage("Error en el ID, por favor recargar fomulario"),
  body("franquicia")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'Franquicia' es obligatorio")
    .isString().withMessage("Formato incorrecto, reingresar datos"),
  body("nombre")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'Nombre' es obligatorio")
    .isString().withMessage("Formato incorrecto, reingresar datos"),
  body("direccion")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isString().withMessage("Formato incorrecto, reingresar datos"),
  body("telefono")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isNumeric().withMessage("El campo 'Teléfono' solo acepta numeros, sin espacios ni guiones"),
  body("gmap")
    .optional({ values: "falsy" })
    .trim()
    .isURL().withMessage("El campo 'Google maps' solo acepta una URL"),
  body("linkmp")
    .optional({ values: "falsy" })
    .trim()
    .isURL().withMessage("El campo 'Link MP' solo acepta una URL"),
  body("img")
    .trim()
    .notEmpty().withMessage("El campo Nombre de Imagen es obligatorio")
    .isString().withMessage("Ingresar nombre de archivo válido")
    .custom(async(nombre, { req }) => {
      if (req.body.tipo == "nuevo") {
        const nombreDuplicado = await fileNames.buscarPathDuplicado(nombre,"locales","img");
        if (nombreDuplicado) {
          throw new Error("Nombre de imagen en uso");
        }
      } else if (req.body.tipo == "editar" && req.body.img != req.body.nombreImgOriginal){
        const nombreDuplicado = await fileNames.buscarPathDuplicado(nombre,"locales","img");
        if (nombreDuplicado) {
          throw new Error("Nombre de imagen en uso");
        }
      }
    }),
];

const validarUsuariosChain = [
  body("usuario")
    .notEmpty().withMessage("El campo 'Usuario' es obligatorio")
    .trim()
    .escape()
    .isAlpha().withMessage("El nombre de usuario solo admite letras, sin espacios ni símbolos")
    .custom(async(usuario) => {
        const nombreDuplicado = await fileNames.buscarPathDuplicado(usuario,"usuarios","usuario");
        if (nombreDuplicado) {
          throw new Error("Nombre de usuario en uso");
        }
    }),
  body("passUser")
    .notEmpty().withMessage("El campo 'Contraseña' es obligatorio")
    .trim()
    .escape()
    .isStrongPassword({minSymbols: 0, minUppercase: 0, minLength: 6, minLowercase: 1, minNumbers: 1}).withMessage("La contraseña debe tener un mínimo de 6 caracteres, y por lo menos 1 número"),
  body("local")
    .trim()
    .escape()
    .isString().withMessage("Error en el campo 'Local', por favor recargar la página"),
  body("rolUser")
    .notEmpty().withMessage("El campo 'Rol' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Error en el campo 'Rol', por favor recargar la página"),
];

const validarUsuariosUpdateChain = [
  body("rolUser")
    .notEmpty().withMessage("El campo 'Rol' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Error en el campo 'Rol', por favor recargar la página"),
]

const validarLoginChain = [
  body("loginUsuario")
    .notEmpty().withMessage("El campo 'Usuario' es obligatorio")
    .trim()
    .escape()
    .isAlpha().withMessage("El nombre de usuario solo admite letras, sin espacios ni símbolos"),
  body("loginPassword")
    .notEmpty().withMessage("El campo 'Contraseña' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato de contraseña incorrecto"),
];

const validarProductoFabricaChain = [
  body("codigo")
    .notEmpty().withMessage("El campo 'Codigo' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("El campo 'Codigo' solo acepta numeros, sin espacios ni guiones"),
  body("categoria")
    .notEmpty().withMessage("El campo 'Categoria' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo Categoría incorrecto"),
  body("nombre")
    .notEmpty().withMessage("El campo 'Nombre' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo Nombre incorrecto"),
  body("descripcion")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isString().withMessage("Formato del campo Descripcion incorrecto"),
  body("costo")
    .notEmpty().withMessage("El campo 'costo' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("El campo 'costo' solo acepta numeros, sin espacios ni guiones"),
  body("unidad")
    .notEmpty().withMessage("El campo 'Unidad' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo Unidad incorrecto"),
  body("sector")
    .notEmpty().withMessage("El campo 'Sector' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo Sector incorrecto"),
];

const validarCategoriaFabricaChain = [
  body("categoria")
    .notEmpty().withMessage("El campo 'Categoría' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo Categoría incorrecto"),
  body("color")
    .notEmpty().withMessage("El campo 'Color' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo Color incorrecto"),
  body("minimo")
    .notEmpty().withMessage("El campo 'minimo' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("El campo 'minimo' solo acepta numeros, sin espacios ni guiones"),
  body("orden")
    .notEmpty().withMessage("El campo 'orden' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("El campo 'orden' solo acepta numeros, sin espacios ni guiones"),
]


const dataValidator = (data) => { 
  if(data.mensaje == ""){
    return false;
  }
  data.mensaje = sanitizeHtml(data.mensaje);
  data.mensaje = data.mensaje.replaceAll(/"/g,"").replaceAll(/'/g,"");
  data.emisor = sanitizeHtml(data.emisor);
  if(data.emisor != "msjL" && data.emisor != "msjU"){
    return false;
  }
  data.nombre = sanitizeHtml(data.nombre);
  data.pedidoNumero = sanitizeHtml(data.pedidoNumero);
  if(isNaN(parseInt(data.pedidoNumero))){
    return false;
  }
  data.localId = sanitizeHtml(data.localId);
  if(isNaN(parseInt(data.localId)) && data.localId !== ""){
    return false;
  }
  if(typeof(data.ring) !== "boolean"){
    return false;
  }
  return true
};

const validarPedidoEstadoChain = [
  body("id")
    .notEmpty().withMessage("El campo 'ID' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'ID' incorrecto"),
  body("estado")
    .notEmpty().withMessage("El campo 'Estado' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'Estado' incorrecto"),
]

const validarStringsChain = [
  body("**")
    .notEmpty()
    .trim()
    .escape()
    .isString()
]

const validarProduccionUpdateChain = [
  body("pedidoProduccionLocalId")
    .notEmpty()
    .trim()
    .escape()
    .isString(),
  body("pedidoProduccionImporteTotal")
    .notEmpty()
    .trim()
    .escape()
    .isString(),
]

const validarQueryActividadChain = [
  body("usuario")
    .optional({ values: "falsy" })
    .trim()
    .escape(),
  body("accion")
    .optional({ values: "falsy" })
    .trim()
    .escape(),
  body("local")
    .optional({ values: "falsy" })
    .trim()
    .escape(),
  body("page")
    .optional({ values: "falsy" })
    .trim()
    .escape()
]


module.exports = {
  validarInput,
  validarNuevaCategoriaChain,
  validarProductoChain,
  validarPreciosChain,
  validarLocalesChain,
  validarUsuariosChain,
  validarUsuariosUpdateChain,
  validarLoginChain,
  validarProductoFabricaChain,
  validarCategoriaFabricaChain,
  validarPedidoEstadoChain,
  validarStringsChain,
  validarProduccionUpdateChain,
  validarQueryActividadChain,
  dataValidator,
};
