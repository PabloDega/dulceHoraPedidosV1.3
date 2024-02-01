const crearFiltroParaQuery = async (filtros) => {
  let query;
  let filtroComillado = []
  filtros.forEach((filtro) => {
    let datos = filtro.split("=");
    if(datos[0] == "page"){return};
    datos[1] = datos[1].replace(/_/g, " ");
    datos[1] = `"${datos[1]}"`;
    let datosUnidos = datos.join("=");
    filtroComillado.push(datosUnidos);
  })

  if(filtroComillado.length == 0){
    query = "";
  } else if(filtroComillado.length == 1){
    query = `WHERE ${filtroComillado[0]}`;
  } else if(filtroComillado.length > 1){
    query = "WHERE " + filtroComillado.join(" AND ");
  }
  return query;
}

module.exports = {
  crearFiltroParaQuery
};
