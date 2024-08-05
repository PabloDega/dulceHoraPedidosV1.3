// ---- Utilidades ----
function monetarizar(valor){
  valor = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
  return valor;
}

const dobleDigito = (numero) => {
  if(numero < 10){
      numero = "0" + numero.toString();
  }
  return numero;
}

function ajustarFecha(fecha){
  //fecha = new Date(fecha.setHours(fecha.getHours()+3));
  return fecha;
}

function mostrarError(info){
  let mensaje = `<div class="mensajeErrorForm"><span>${info}</span><span id="timeBar"></span></div>`;
  document.querySelector("#errores").innerHTML = mensaje;
  document.querySelector(".mensajeErrorForm").addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}

function actualizarBotonesDeFiltro(stats){
  document.querySelectorAll(".filtrarDias").forEach((boton) => {
    boton.dataset.stats = stats;
  })
  document.querySelector("#statsVerTodo").dataset.stats = stats;
  document.querySelector("#statsFechasCalendario").dataset.stats = stats;
}

function textoTipoFrase(texto){
  let nombreProducto = texto.toLowerCase();
  nombreProducto = nombreProducto.split(" ");
  nuevoNombre = []
  nombreProducto.forEach((palabra) => {
    if(palabra.length > 3 || palabra === "pan"){
      nuevaPalabra = palabra[0].toUpperCase() + palabra.slice(1);
      nuevoNombre.push(nuevaPalabra);
    } else {
      nuevoNombre.push(palabra)
    }
  });
  nombreProducto = nuevoNombre.join(" ");
  return nombreProducto;
}


// ---- Eventos -----
window.addEventListener("load", () => {
  window.resumenVentas.forEach((dia) => {
      ventasTotalxDia.push(dia.totalDia);
  });
  window.resumenVentas.forEach((dia) => {
      diasDelResumen.push(dia.fecha);
  }); 

  iniciarChart();
});

document.querySelector("#statsFechasCalendario").addEventListener("click", (e) => {
  mostrarFiltroManual(e.currentTarget.dataset);
});

document.querySelectorAll(".filtrarDias").forEach((boton) => {
  boton.addEventListener("click", (e) => {
    if(e.currentTarget.dataset.stats === "ventasTotal"){
      filtrarChartVentasDias(e);
    } else if(e.currentTarget.dataset.stats === "operacionesPromedio"){
      filtrarChartOperacionesDias(e);
    } else if(e.currentTarget.dataset.stats === "productosTotal"){
      filtrarChartProductos(e);
    }
  })
});

document.querySelector("#statsVerTodo").addEventListener("click", (e) => {
  document.querySelector("#statsChart").innerHTML = "";
  chartPath(e);
});

document.querySelector("#statsBtnVentas").addEventListener("click", (e) => {
  document.querySelector("#statsChart").innerHTML = "";
  iniciarChart(e);
});

document.querySelector("#statsBtnCronograma").addEventListener("click", (e) => {
  iniciarChartCronograma(e);
})

document.querySelector("#statsBtnProductos").addEventListener("click", (e) => {
  iniciarChartProductos(e);
})

// ---- Variables iniciales ----
let ventasTotalxDia = [];
let diasDelResumen = [];
let options;
let chart;

// ---------

function chartPath(e){
  let stats = e.currentTarget.dataset.stats;
  if(stats === "ventasTotal"){
    iniciarChart(e);
    return;
  } else if(stats === "operacionesPromedio"){
    iniciarChartCronograma(e);
  } else if(stats === "productosTotal"){
    iniciarChartProductos(e);
  }
}

function iniciarChart(e){
  let periodo;
  if(!e){
    periodo = "Todos los datos"
  } else {
    periodo = e.currentTarget.dataset.periodo;
  }

  actualizarBotonesDeFiltro("ventasTotal");

  options = {
    chart: {
      type: 'bar',
      width: '100%',
    },
    series: [{
      name: 'Monto total de ventas',
      data: ventasTotalxDia,
    }],
    yaxis: {
        labels: {
          formatter: (valor) => monetarizar(valor),
        },
      },
    xaxis: {
      categories: diasDelResumen,
      type: "datetime",
    },
    theme: {
      mode: 'light', 
      palette: 'palette1', 
      monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'light',
          shadeIntensity: 0.65
        },
    },
    dataLabels: {
      enabled: false,
    },
    zoom: {
      type: "x",
      enabled: true,
      autoScaleYaxis: true
    },
    title: {
      text: 'Total de ventas',
      align: 'center',
      offsetY: 30,
      style: {
        color: '#444',
        fontSize: "1.2em",
      }
    },
    subtitle: {
      text: periodo,
      align: 'center',
      offsetY: 50,
      style: {
        color: '#444',
        fontSize: "1em",
      }
    }
  }
  
  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}

function filtrarChartVentasDias(e){
  let hoy = new Date();
  hoy.setDate(hoy.getDate() - (e.currentTarget.dataset.dias - 1));
  let dias = [];
  let ventas = [];
  for (let i = 0; i < (e.currentTarget.dataset.dias); i++) {
    let data = dobleDigito(hoy.getFullYear()) + "-" + dobleDigito((hoy.getMonth() + 1)) + "-" + dobleDigito(hoy.getDate());
    dias.push(data);
    let diaIndex = diasDelResumen.findIndex((dia) => dia === data);
    if(diaIndex !== -1){
      ventas.push(ventasTotalxDia[diaIndex]);
    } else {
      ventas.push(0);
    }
    hoy.setDate(hoy.getDate() + 1);
  }
  
  options.series[0].data = ventas;
  options.xaxis.categories = dias;
  options.subtitle.text = e.currentTarget.dataset.periodo;

  document.querySelector("#statsChart").innerHTML = "";
  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}

function filtrarPorFechas(fechas, variable){
  /* fechas.inicial = ajustarFecha(new Date(document.querySelector("#fechaInicio").value));
  fechas.final = ajustarFecha(new Date(document.querySelector("#fechaFinal").value)); */
  let info = structuredClone(window[variable])
  let respuesta = info.filter((item) => {
    let fecha = ajustarFecha(new Date(item.fecha));
    return fecha >= fechas.inicial && fecha <= fechas.final;
  });
  return respuesta;
}

function mostrarFiltroManual(dataset){
  let cortina = document.querySelector("#cortina");
  cortina.innerHTML = `<div id="statsCalendario">
        <h2>Filtrar por fechas</h2>
        <span><label for="fechaInicio">Inicio:</label>  <input type="date" name="fechaInicio" id="fechaInicio"></span>
        <span><label for="fechaFinal">Fin:</label> <input type="date" name="fechaFinal" id="fechaFinal"></span>
        <div class="btn btnNaranja" id="btnFiltroManual" data-stats="resumenVentas">Filtrar</div>
    </div>`;
  cortina.style.display = "flex";
  document.querySelector("#btnFiltroManual").addEventListener("click", (e) => {
    crearObjetosFiltroManual(e.currentTarget.dataset);
    cortina.innerHTML = "";
    cortina.style.display = "none";
  });
}

async function crearObjetosFiltroManual(dataset){
    let fechas = {};
    fechas.inicial = ajustarFecha(new Date(document.querySelector("#fechaInicio").value));
    fechas.final = ajustarFecha(new Date(document.querySelector("#fechaFinal").value));
    // validar fechas
    if(fechas.inicial == "Invalid Date" || fechas.final == "Invalid Date"){
      mostrarError("Por favor seleccione fecha de inicio y de fin para poder aplicar el filtro");
      return;
    } else if(fechas.inicial > fechas.final){
      mostrarError("La fecha inicial debe ser menor a la fecha final");
      return;
    }
    let infoFiltrada = await filtrarPorFechas(fechas, dataset.stats);

    if(dataset.stats === "resumenVentas"){
      filtrarChartVentasDiasManual(infoFiltrada);
    } else if(dataset.stats === "facturas"){
      filtrarChartFacturasManual(infoFiltrada);
    }
}

function filtrarChartVentasDiasManual(infoFiltrada){
  let ventas = [];
  infoFiltrada.forEach((dia) => {
    ventas.push(dia.totalDia);
  });
  let dias = [];
  infoFiltrada.forEach((dia) => {
    dias.push(dia.fecha);
  });
  document.querySelector("#statsChart").innerHTML = "";
  options.series[0].data = ventas;
  options.xaxis.categories = dias;
  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}

/* function filtrarChartFacturasManual(infoFiltrada, dato){
  let total = [];
  infoFiltrada.forEach((dia) => {
    total.push(dia[dato]);
  });
  let dias = [];
  infoFiltrada.forEach((dia) => {
    dias.push(dia.fecha);
  });
  document.querySelector("#statsChart").innerHTML = "";
  options.series[0].data = total;
  options.xaxis.categories = dias;
  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
} */

function crearResumenChartCronograma(fechas){
  let info;
  if(fechas){
    info = filtrarPorFechas(fechas, "resumenVentas");
  } else {
    info = window.resumenVentas;
  }
  
  let horas = [];
  for (let i = 0; i < 24; i++) {
    let objCronograma = {
      hora: i,
      operaciones: 0,
      operacionesPromedio: 0,
      ventas: 0,
      ventasPromedio: 0,
    };
    horas.push(objCronograma);
  }
  
  info.forEach((dia) => {
    dia.cronograma.forEach((hr, i) => {
      if(hr.operaciones === 0){
        return;
      }
      horas[i].operaciones += hr.operaciones;
      horas[i].ventas += hr.total;
    })
  });
  horas.forEach((hora) => {
    /* let operacionesPromedioCalculo = hora.operaciones / info.length;
    operacionesPromedioCalculo = Math.round(operacionesPromedioCalculo*100)/100;
    hora.operacionesPromedio = operacionesPromedioCalculo;
    let ventasPromedioCalculo = hora.ventas / info.length;
    ventasPromedioCalculo = Math.round(ventasPromedioCalculo*100)/100;
    hora.ventasPromedio = ventasPromedioCalculo;
    hora.ventas = Math.round(hora.ventas*100)/100; */
    hora.operacionesPromedio = Math.round((hora.operaciones / info.length)*100)/100;;
    hora.ventasPromedio = Math.round((hora.ventas / info.length)*100)/100;
    hora.ventas = Math.round(hora.ventas*100)/100;
  })

  return horas;
}


function iniciarChartCronograma(e, fechas){
  actualizarBotonesDeFiltro(e.currentTarget.dataset.stats);
  let info = crearResumenChartCronograma(fechas);
  let infoSeries = crearObjetoCronograma(info, e.currentTarget.dataset);

  options = {
    chart: {
      type: 'bar',
      width: '100%',
    },
    series: infoSeries,
    theme: {
      mode: 'light', 
      palette: 'palette1', 
      monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'light',
          shadeIntensity: 0.65
        },
    },
    xaxis: {
      tickAmount: infoSeries[0].data.length - 1,
    },
    title: {
      text: 'Promedio de operaciones por hora',
      align: 'center',
      offsetY: 30,
      style: {
        color: '#444',
        fontSize: "1.2em",
      }
    },
    subtitle: {
      text: e.currentTarget.dataset.periodo,
      align: 'center',
      offsetY: 50,
      style: {
        color: '#444',
        fontSize: "1em",
      }
    }
  }
  document.querySelector("#statsChart").innerHTML = "";
  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}

function crearObjetoCronograma(info, variable){
  if(!variable){
    variable = {};
  }
  if(!variable.stats){
    variable.stats = "operacionesPromedio";
  }
  if(!variable.name){
    variable.name = "Operaciones Promedio";
  }

  let hrInicioReporte = 7;
  let hrFinalReporte = 22;
  let series = [{
    name: variable.name,
    data: [],
  }];
  info.forEach((hora, i) => {
    if(i < hrInicioReporte || i > hrFinalReporte){
      return
    }
    let dataCoord = {
      x: i,
      y: hora[variable.stats],
    }
    series[0].data.push(dataCoord)
  })
  return series;
}

/* function crearObjetoCronogramaHeat(info, variable){
  if(!variable){
    variable = "operaciones";
  }
  let hrInicioReporte = 7;
  let hrFinalReporte = 22;
  let dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  let series = [];
  info.forEach((hora, i) => {
    if(i < hrInicioReporte || i > hrFinalReporte){
      return
    }
    let objetoSerie = {
      name: i,
      data: [],
    }
    dias.forEach((dia) => {
      let dataCoord = {
        x: dia,
        y: hora[variable],
      }
      objetoSerie.data.push(dataCoord)
    });
    series.push(objetoSerie);
  });
  console.log(series)
} */

function filtrarChartOperacionesDias(e){
  let inicial = new Date();
  let final = new Date();
  inicial.setDate(inicial.getDate() - (e.currentTarget.dataset.dias - 1));
  let fechas = {
    inicial,
    final,
  }
  iniciarChartCronograma(e, fechas);
}

function filtrarChartProductos(e){
  let inicial = new Date();
  let final = new Date();
  inicial.setDate(inicial.getDate() - (e.currentTarget.dataset.dias - 1));
  let fechas = {
    inicial,
    final,
  }
  iniciarChartProductos(e, fechas);
}

function iniciarChartProductos(e, fechas){
  actualizarBotonesDeFiltro(e.currentTarget.dataset.stats);
  let info = crearResumenChartProductos(fechas);
  let infoSeries = crearObjetoProductosMasVendidos(info, e.currentTarget.dataset);

  options = {
    chart: {
      type: 'bar',
      width: '100%',
    },
    series: infoSeries.seriesMasVendidos,
    theme: {
      mode: 'light', 
      palette: 'palette1', 
      monochrome: {
          enabled: false,
          color: '#255aee',
          shadeTo: 'light',
          shadeIntensity: 0.65
        },
    },
    title: {
      text: 'Promedio de productos mas vendidos',
      align: 'center',
      offsetY: 30,
      style: {
        color: '#444',
        fontSize: "1.2em",
      }
    },
    subtitle: {
      text: e.currentTarget.dataset.periodo,
      align: 'center',
      offsetY: 50,
      style: {
        color: '#444',
        fontSize: "1em",
      }
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: true,
      borderColor: '#90A4AE',
      xaxis: {
          lines: {
              show: true
          }
      },   
    },
  }

  document.querySelector("#statsChart").innerHTML = "";
  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}

function crearResumenChartProductos(fechas){
  let info;
  if(fechas){
    info = filtrarPorFechas(fechas, "resumenVentas");
  } else {
    info = structuredClone(window.resumenVentas);
  }
  
  let productosResumen = [];
  info.forEach((dia) => {
    dia.productos.forEach((item) => {
      let infoDelProd = window.productos.find((prod) => prod.id === item[5]);
      if(infoDelProd === undefined){
        return;
      } else if(infoDelProd.fraccionamiento === "kilo"){
        item[4] = item[4]/250;
      } else if(infoDelProd.fraccionamiento === "docena"){
        item[4] = item[4]/12;
      }
      item.push(textoTipoFrase(infoDelProd.nombre));
      item.push(textoTipoFrase(infoDelProd.categoria));
      let buscarProd = productosResumen.findIndex((prod) => prod[5] === item[5]);
      if(buscarProd !== -1){
        productosResumen[buscarProd][1] += item[1];
        productosResumen[buscarProd][4] += item[4];
      } else {
        productosResumen.push(item);
      }
    });
  });

  // Calcular promedio en base a total / info.length
  productosResumen.forEach((producto) => {
    let promedio = producto[1] / info.length;
    producto.push(Math.round(promedio*100)/100);
    let promedioCantidadVentas = producto[4] / info.length;
    producto.push(Math.round(promedioCantidadVentas*100)/100);
    producto[1] = Math.round(producto[1]*100)/100;
    producto[4] = Math.round(producto[4]);
  })
  productosResumen = productosResumen.sort((a, b) => b[4] - a[4]);
  return productosResumen;
}

function crearObjetoProductosMasVendidos(info, dataset){
  let objeto = {}
  // Filtrar cantidad de productos mas vendidos para mostrar
  let prodsDelResumen = 10;
  if(dataset.productos){
    if(isNaN(dataset.productos)){
      return
    }
    prodsDelResumen = dataset.productos;
  }
  
  let productosMasVendidos = info.slice(0, prodsDelResumen);
  objeto.productosMasVendidos = productosMasVendidos;
  let seriesMasVendidos = [{
    name: "Promedio de productos mas vendidos",
    data: [],
  }];
  console.log(productosMasVendidos)
  productosMasVendidos.forEach((producto) => {
    let obj = {}
    obj.y= producto[9];
    obj.x = producto[6];
    seriesMasVendidos[0].data.push(obj);
  });
  objeto.seriesMasVendidos = seriesMasVendidos;
  return objeto;
}