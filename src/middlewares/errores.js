const erroresGral = async (error) => {
    if(error === undefined){
        return;
    }
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
    if (error == "query1") {
        let error = { msg: "Los datos cargados para efectuar la consulta son incorrectos, recargue la página y vuelva a intentarlo" };
        errores.push(error);
        return errores;
    }
    if (error == "query2") {
        let error = { msg: "No se econtraron resultados para la consulta" };
        errores.push(error);
        return errores;
    }
    if (error == "reporte1") {
        let error = { msg: "No se econtraron pedidos para la fecha seleccionada" };
        errores.push(error);
        return errores;
    }
    if (error == "acceso1") {
        let error = { msg: "No posee acceso para el servicio que intenta utilizar" };
        errores.push(error);
        return errores;
    }
    if (error == "validacion1") {
        let error = { msg: "Error al validar el pedido, por favor recargue la página y vuelva a intentarlo" };
        errores.push(error);
        return errores;
    }
    if (error == "produccion1") {
        let error = { msg: "Su usuario no tiene el nivel de acceso necesario para editar el pedido" };
        errores.push(error);
        return errores;
    }
};

module.exports = {
    erroresGral,
};
