const erroresGral = async (error) => {
    let errores = [];
    if (error == "caja1") {
        let error = { msg: "Debe abrir una caja para comenzar a facturar" };
        errores.push(error);
        return errores;
    }
    if (error == "datosFiscales1") {
        let error = { msg: "Falta información fiscal del local para poder iniciar el módulo de facturacion, por favor contactarse con administración" };
        errores.push(error);
        return errores;
    }
};

module.exports = {
    erroresGral,
};
