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

// ---- Eventos -----
window.addEventListener("load", () => {iniciarChart()});

document.querySelector("#statsFechasCalendario").addEventListener("click", (e) => {
  mostrarFiltroManual(e.currentTarget.dataset);
});

document.querySelectorAll(".filtrarDias").forEach((boton) => {
  boton.addEventListener("click", (e) => {
    filtrarChartDias(e.currentTarget.dataset.dias)
  })
});

document.querySelector("#statsVerTodo").addEventListener("click", () => {
  document.querySelector("#statsChart").innerHTML = "";
  iniciarChart();
});

document.querySelector("#statsBtnVentas").addEventListener("click", () => {
  document.querySelector("#statsChart").innerHTML = "";
  iniciarChart();
});

document.querySelector("#statsBtnCronograma").addEventListener("click", (e) => {
  iniciarChartCronograma(e);
})

// ---- Variables iniciales ----

let ventasTotalxDia = [];
window.resumenVentas.forEach((dia) => {
    ventasTotalxDia.push(dia.totalDia);
});

let diasDelResumen = [];
window.resumenVentas.forEach((dia) => {
    diasDelResumen.push(dia.fecha);
});

let options;
let chart;

// ---------

function iniciarChart(){
  options = {
    chart: {
      type: 'bar',
      width: '100%',
    },
    series: [{
      name: 'Venta',
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
  }
  
  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}

function filtrarChartDias(nDias){
  let hoy = new Date();
  hoy.setDate(hoy.getDate() - (nDias - 1));
  let dias = [];
  let ventas = [];
  for (let i = 0; i < (nDias); i++) {
    let data = dobleDigito(hoy.getFullYear()) + "-" + dobleDigito((hoy.getMonth() + 1)) + "-"  + dobleDigito(hoy.getDate());
    dias.push(data);
    let diaIndex = diasDelResumen.findIndex((dia) => dia === data);
    if(diaIndex !== -1){
      ventas.push(ventasTotalxDia[diaIndex]);
    } else {
      ventas.push(0);
    }
    hoy.setDate(hoy.getDate() + 1);
  }

  document.querySelector("#statsChart").innerHTML = "";
  
  options.series[0].data = ventas;
  options.xaxis.categories = dias;

  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}

function filtrarPorFechas(fechas, variable){
  /* fechas.inicial = ajustarFecha(new Date(document.querySelector("#fechaInicio").value));
  fechas.final = ajustarFecha(new Date(document.querySelector("#fechaFinal").value)); */
  let respuesta = window[variable].filter((item) => {
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
        <div class="btn btnNaranja" id="btnFiltroManual" data-stats="${dataset.stats}">Filtrar</div>
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
      filtrarChartDiasManual(infoFiltrada);
    } else if(dataset.stats === "facturas"){
      filtrarChartFacturasManual(infoFiltrada);
    }
}

function filtrarChartDiasManual(infoFiltrada){
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

function filtrarChartFacturasManual(infoFiltrada, dato){
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
}

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
    let operacionesPromedioCalculo = hora.operaciones / info.length;
    operacionesPromedioCalculo = Math.round(operacionesPromedioCalculo*100)/100;
    hora.operacionesPromedio = operacionesPromedioCalculo;
    let ventasPromedioCalculo = hora.ventas / info.length;
    ventasPromedioCalculo = Math.round(ventasPromedioCalculo*100)/100;
    hora.ventasPromedio = ventasPromedioCalculo;
    hora.ventas = Math.round(hora.ventas*100)/100;
  })

  return horas;
}


function iniciarChartCronograma(e, fechas){

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
    }
  }
  document.querySelector("#statsChart").innerHTML = "";
  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}

function crearObjetoCronograma(info, variable){
  if(!variable){
    variable = {};
    variable.stats = "operacionesPromedio";
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