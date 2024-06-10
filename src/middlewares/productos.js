const crearObjetoUpdatePrecios = (datos) => {
    if(datos.id === undefined){
        return
    }
    let items;
    if(typeof(datos.id) == "string"){
        items = [];
        items.push(datos.id)
    }
    if(typeof(datos.id) == "object"){
        items = datos.id;
    }
    let objetoPrecios = {}
    items.forEach((item) => {
        let precios = [];
        precios.push(datos[`preciounidad${item}`]);
        precios.push(datos[`preciodocena${item}`]);
        precios.push(datos[`preciokilo${item}`]);
        precios = rellenarEspacioVacios(precios);
        objetoPrecios[item] = precios;
    });
    return objetoPrecios;
}

const rellenarEspacioVacios = (precios) => {
    precios.forEach((precio, i) => {
        if(precio == ""){
            precios[i] = 0;
        } else {
            precios[i] = parseFloat(precio)
        }
    })
    return precios;
}

const buscarDuplicadosProdPersonalizados = async (codigo, productos) => {
    let resultado = {
        error: false,
        msg: "",
    };
    if(isNaN(parseInt(codigo))){
        resultado.error = true;
        resultado.msg = "Formato de codigo incorrecto";
        return resultado;
    }
    codigo = parseInt(codigo);
    if(codigo < 1 || codigo > 99){
        resultado.error = true;
        resultado.msg = "El codigo de producto debe estar entre 1 y 99";
        return resultado;
    }
    const busqueda = productos.find((prod) => prod.codigo == codigo)
    if(busqueda !== undefined){
        resultado.error = true;
        resultado.msg = "El codigo ingresado se encuentra en uso";
        return resultado;
    }
    return resultado;
}

const buscarDuplicadosProdLocal = async (productos, codigo) => {
    let respuesta = {
        error: false,
        msg: "",
    }
    if(isNaN(parseInt(codigo))){
        respuesta.error = true;
        respuesta.msg = "Formato de codigo incorrecto";
        return respuesta;
    }
    codigo = parseInt(codigo);
    if(codigo < 100 || codigo > 999){
        respuesta.error = true;
        respuesta.msg = "El codigo de producto debe estar entre 100 y 999";
        return respuesta;
    }
    let busqueda = productos.find((prod) => prod.codigo == codigo);
    if(busqueda !== undefined){
        respuesta.error = true;
        respuesta.msg = `El codigo de producto ${codigo} esta actualmente en uso`;
        return respuesta;
    }
    return respuesta;
}

const buscarDuplicadosProdFabrica = async (productos, codigo) => {
    let respuesta = {
        error: false,
        msg: "",
    }
    if(isNaN(parseInt(codigo))){
        respuesta.error = true;
        respuesta.msg = "Formato de codigo incorrecto";
        return respuesta;
    }
    codigo = parseInt(codigo);
/*     if(codigo < 100 || codigo > 999){
        respuesta.error = true;
        respuesta.msg = "El codigo de producto debe estar entre 100 y 999";
        return respuesta;
    } */
    let busqueda = productos.find((prod) => prod.codigo == codigo);
    if(busqueda !== undefined){
        respuesta.error = true;
        respuesta.msg = `El codigo de producto ${codigo} esta actualmente en uso`;
        return respuesta;
    }
    return respuesta;
}

module.exports = {
    crearObjetoUpdatePrecios,
    buscarDuplicadosProdPersonalizados,
    buscarDuplicadosProdLocal,
    buscarDuplicadosProdFabrica,
}