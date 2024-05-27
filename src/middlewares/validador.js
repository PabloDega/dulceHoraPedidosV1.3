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
  /* body("cuit")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'cuit' es obligatorio")
    .isNumeric().withMessage("Formato incorrecto, reingresar datos"),
  body("impuestos")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'impuestos' es obligatorio")
    .isString().withMessage("Formato incorrecto, reingresar datos"),
  body("ptoventa")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'pto de venta' es obligatorio")
    .isNumeric().withMessage("Formato incorrecto, reingresar datos"), */
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
  body("fecha")
    .notEmpty().withMessage("Todos los campos son obligatorios")
    .trim()
    .escape()
    .isString(),
  body("minimos")
    .notEmpty().withMessage("Todos los campos son obligatorios")
    .trim()
    .escape()
    .isString(),
  body("local")
    .notEmpty().withMessage("Todos los campos son obligatorios")
    .trim()
    .escape()
    .isString(),
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

const validarBotonFacturacionChain = [
  body("codigo")
    .notEmpty().withMessage("El campo 'Codigo' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'Codigo' incorrecto"),
  body("detalle")
    .notEmpty().withMessage("El campo 'detalle' es obligatorio")
    .trim()
    .isString().withMessage("Formato del campo 'detalle' incorrecto"),
  body("cantidad")
    .notEmpty().withMessage("El campo 'cantidad' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'cantidad' incorrecto"),
  body("orden")
    .notEmpty().withMessage("El campo 'orden' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'orden' incorrecto"),
  body("estado")
    .notEmpty().withMessage("El campo 'estado' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'estado' incorrecto"),
]

const validarFacturacionChain = [
  body("fecha")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'fecha' incorrecto"),
  body("tipo")
    .notEmpty().withMessage("El campo 'tipo' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'tipo' incorrecto"),
  body("formaDePago")
    .notEmpty().withMessage("El campo 'formaDePago' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'formaDePago' incorrecto"),
  body("cuit")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'cuit' incorrecto"),
  body("datos")
    .notEmpty().withMessage("El campo 'datos' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'datos' incorrecto"),
  body("neto")
    .notEmpty().withMessage("El campo 'neto:' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'neto:' incorrecto"),
  body("iva10")
    .notEmpty().withMessage("El campo 'iva10' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'iva10' incorrecto"),
  body("netoiva10")
    .notEmpty().withMessage("El campo 'netoiva10' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'netoiva10' incorrecto"),
  body("iva21")
    .notEmpty().withMessage("El campo 'iva21' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'iva21' incorrecto"),
  body("netoiva21")
    .notEmpty().withMessage("El campo 'netoiva21' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'netoiva21' incorrecto"),
  body("total")
    .notEmpty().withMessage("El campo 'total' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'total' incorrecto"),
  body("senia")
    .notEmpty().withMessage("El campo 'senia' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'senia' incorrecto"),
  body("nombresenia")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'Nombre de seña' incorrecto"),
  body("imprimir")
    .notEmpty().withMessage("El campo 'imprimir' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'imprimir' incorrecto"),
  body("pagoMultiple")
    .optional({ values: "falsy" })
    .isJSON().withMessage("Formato del campo 'Pago Multiple' incorrecto"),
    // NC
  body("NCtipo")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'NCtipo' incorrecto"),
  body("NCptoVenta")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'NCptoVenta' incorrecto"),
  body("NCnro")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'NCnro' incorrecto"),
  body("NCcuit")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'NCcuit' incorrecto"),
  body("NCfecha")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'NCfecha' incorrecto"),
  body("pago")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'pago' incorrecto"),
  body("vuelto")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'vuelto' incorrecto"),
]

const validarCategoriaReporteChain = [
  body("categoria")
    .notEmpty().withMessage("El campo 'categoria' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'categoria' incorrecto"),
  body("productos")
    .notEmpty().withMessage("El campo 'productos' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'productos' incorrecto"),
  body("seccion")
    .notEmpty().withMessage("El campo 'seccion' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'seccion' incorrecto"),
  body("orden")
    .notEmpty().withMessage("El campo 'orden' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'orden' incorrecto"),
]

const validarGastosChain = [
  body("fecha")
    .notEmpty().withMessage("El campo 'fecha' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'fecha' incorrecto"),
  body("movimiento")
    .notEmpty().withMessage("El campo 'movimiento' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'movimiento' incorrecto"),
  body("monto")
    .notEmpty().withMessage("El campo 'monto' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'monto' incorrecto"),
  body("detalles")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'detalles' incorrecto"),
];

const validarDatosFiscalesChain = [
  body("local")
    .notEmpty().withMessage("El campo 'local' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'local' incorrecto"),
  body("razonsocial")
    .notEmpty().withMessage("El campo 'razonsocial' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'razonsocial' incorrecto"),
  body("cuit")
    .notEmpty().withMessage("El campo 'cuit' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'cuit' incorrecto"),
  body("iibb")
    .notEmpty().withMessage("El campo 'Ingresos Brutos' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'Ingresos Brutos' incorrecto"),
  body("impuestos")
    .notEmpty().withMessage("El campo 'impuestos' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'impuestos' incorrecto"),
  body("ptoventa")
    .notEmpty().withMessage("El campo 'Punro de Venta' es obligatorio")
    .trim()
    .escape()
    .isNumeric().withMessage("Formato del campo 'Punro de Venta' incorrecto"),
  body("domiciliofiscal")
    .notEmpty().withMessage("El campo 'Domicilio Fiscal' es obligatorio")
    .trim()
    .escape()
    .isString().withMessage("Formato del campo 'Domicilio Fiscal' incorrecto"),
  body("inicioactividades")
    .notEmpty().withMessage("El campo 'Inicio de Actividades' es obligatorio")
    .trim()
    .escape()
    .isDate().withMessage("Formato del campo 'Inicio de Actividades' incorrecto"),
];

const validarProductoPersChain = [
  body("codigo")
    .trim()
    .notEmpty().withMessage("Error en el codigo, por favor recargar fomulario")
    .isNumeric().withMessage("Error en el codigo, por favor recargar fomulario"),
  body("nombre")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'Nombre' es obligatorio")
    .isString().withMessage("La categoría solo puede contener texto"),
  body("descripcion")
    .optional({ values: "falsy" })
    .trim()
    .escape(),
  body("precio")
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
    .notEmpty().withMessage("El campo 'estado' es obligatorio")
    .isString().withMessage("El campo estado solo puede contener texto"),
];

const validarCajaChain = [
  body("efectivo")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'efectivo' es obligatorio")
    .isNumeric().withMessage("El campo 'efectivo' solo puede contener numeros"),
  body("reservado")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'reservado' es obligatorio")
    .isNumeric().withMessage("El campo 'reservado' solo puede contener numeros"),
  body("nombre")
    .trim()
    .escape()
    .notEmpty().withMessage("El campo 'nombre' es obligatorio")
    .isString().withMessage("El campo 'nombre' solo puede contener numeros"),
  body("ajuste")
    .trim()
    .escape()
    .notEmpty().withMessage("Error el el formulario, por favor recargue la página")
    .isNumeric().withMessage("Error el el formulario, por favor recargue la página"),
  body("id")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isNumeric().withMessage("Error el el formulario, por favor recargue la página"),
];

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
  validarBotonFacturacionChain,
  validarFacturacionChain,
  validarCategoriaReporteChain,
  validarGastosChain,
  validarDatosFiscalesChain,
  validarProductoPersChain,
  validarCajaChain,
  dataValidator,
};
