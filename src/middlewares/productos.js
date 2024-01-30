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

module.exports = {
    crearObjetoUpdatePrecios,
}