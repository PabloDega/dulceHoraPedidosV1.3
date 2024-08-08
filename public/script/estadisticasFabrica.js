let fechaReferencia = {}

// ---- Utilidades ----
function monetarizar(valor) {
    valor = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
    return valor;
}

const dobleDigito = (numero) => {
    if (numero < 10) {
        numero = "0" + numero.toString();
    }
    return numero;
};

function mostrarError(info) {
    let mensaje = `<div class="mensajeErrorForm"><span>${info}</span><span id="timeBar"></span></div>`;
    document.querySelector("#errores").innerHTML = mensaje;
    document
        .querySelector(".mensajeErrorForm")
        .addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}

function actualizarBotonesDeFiltro(stats) {
    document.querySelectorAll(".filtrarDias").forEach((boton) => {
        boton.dataset.stats = stats;
    });
    document.querySelector("#statsVerTodo").dataset.stats = stats;
    document.querySelector("#statsFechasCalendario").dataset.stats = stats;
}

function textoTipoFrase(texto) {
    let nombreProducto = texto.toLowerCase();
    nombreProducto = nombreProducto.split(" ");
    nuevoNombre = [];
    nombreProducto.forEach((palabra) => {
        if (palabra.length > 3 || palabra === "pan") {
            nuevaPalabra = palabra[0].toUpperCase() + palabra.slice(1);
            nuevoNombre.push(nuevaPalabra);
        } else {
            nuevoNombre.push(palabra);
        }
    });
    nombreProducto = nuevoNombre.join(" ");
    return nombreProducto;
}

function filtrarFacturacionPorDia(fecha){
  if(!fecha){
    let hoy = new Date();
    fecha = dobleDigito(hoy.getFullYear()) + "-" + dobleDigito((hoy.getMonth() + 1)) + "-" + dobleDigito(hoy.getDate());
  }
  let objetoVacio = {
    totalDia: 0,
    totalNF: 0,
    totalCAE: 0,
    totalEfectivo: 0,
    totalDebito: 0,
    totalCredito: 0,
    totalNB: 0,
    totalSeniado: 0,
    contadorOperaciones: 0,
    promedio: 0,
    contadorCAE: 0,
    contadorComanda: 0,
    fecha,
    cronograma: [],
    productos: [],
  }
  let facturacionDiaria = [];
  statsFacturacion.forEach((local) => {
    let resumenDelDia = local.facturacion.findIndex((dia) => dia.fecha == fecha);
    let info = {
      local: local.local,
      fecha,
    }
    if(resumenDelDia !== -1){
      info.facturacion = local.facturacion[resumenDelDia];
    } else {
      info.facturacion = objetoVacio;
    }
    facturacionDiaria.push(info);
  })

  return facturacionDiaria;
}

function filtrarFacturacionPorPeriodo(fechas){
  let resumenxDia = [];
  fechas = {
    inicial: new Date("2024-07-27"),  
    final: new Date("2024-07-31"),
  }
  let pediodoDias = (fechas.final - fechas.inicial) / 1000 / 60 / 60 / 24;
  for (let i = 0; i < pediodoDias + 1; i++) {
    let dia = fechas.inicial;
    dia.setDate(dia.getDate()+1);
    console.log(dia);
  }
}

filtrarFacturacionPorPeriodo()

function acumuladorDeVentasxDia(){}

function crearObjetoChartLocalesxDia(info){
  info.sort((a, b) => b.facturacion.totalDia - a.facturacion.totalDia);
  info.forEach((local) => {
    local.local = textoTipoFrase(local.local);
  })
  let locales = [];
  info.forEach((local) => {
      locales.push(local.local);
  });
  let ventas = [];
  info.forEach((local) => {
      ventas.push(local.facturacion.totalDia);
  });
  let fecha = info[0].fecha
  return {locales, ventas, fecha};
}

function rotarFecha(fecha){
  let arrayFecha = fecha.split("-");
  arrayFecha.reverse();
  let nuevaFecha = arrayFecha.join("-");
  return nuevaFecha;
}

function removerClasesBtnFabrica(elementos, clase){
  document.querySelectorAll(`.${elementos}`).forEach((btn) => {
    btn.classList.remove(`${clase}`)
  })
}

function colorearBotonesStatsFabrica(botones){
  removerClasesBtnFabrica("statsFabrica", "btnNaranja");
  botones.forEach((boton) => {
    document.querySelector(`#${boton}`).classList.add("btnNaranja")
  })
}

function colorearBotonesStatsFiltrosLocales(boton){
  document.querySelectorAll(".statsFiltrosLocales").forEach((btn) => {btn.classList.remove("btnNaranja")});
  document.querySelector(`#${boton}`).classList.add("btnNaranja");
}

// ---- Eventos -----
window.addEventListener("load", () => {
  iniciarChartVentasDelDia();
});

if(document.querySelector("#fechaEstadisticaFabrica") !== null){
  document.querySelector("#fechaEstadisticaFabrica").addEventListener("change", (e) => {
    iniciarChartVentasDelDia(e.target.value);
  })
};

document.querySelector("#statsValoresPromedio").addEventListener("click", (e) => {
  colorearBotonesStatsFabrica([e.currentTarget.id,"statsBtnVentas", "statsLocalesTodos", "statsSemana"])
  document.querySelector("#statsDiarios").style.display = "none";
});

document.querySelector("#statsValoresTotales").addEventListener("click", (e) => {
  colorearBotonesStatsFabrica([e.currentTarget.id,"statsBtnVentas", "statsLocalesTodos", "statsDiarios"])
  document.querySelector("#statsDiarios").style.display = "flex";
});

document.querySelector("#statsLocalesTodos").addEventListener("click", (e) => {
  colorearBotonesStatsFiltrosLocales(e.currentTarget.id);
});

document.querySelector("#statsLocalesTop10").addEventListener("click", (e) => {
  colorearBotonesStatsFiltrosLocales(e.currentTarget.id);
});

document.querySelector("#statsLocalesIndividual").addEventListener("click", (e) => {
  colorearBotonesStatsFiltrosLocales(e.currentTarget.id);
});

// ---- Funciones ----

function iniciarChartVentasDelDia(fecha){
  document.querySelector("#statsBtnVentas").classList.add("btnNaranja");
  document.querySelector("#statsValoresTotales").classList.add("btnNaranja");
  document.querySelector("#statsLocalesTodos").classList.add("btnNaranja");
  document.querySelector("#statsLocalesTodos").classList.add("btnNaranja");
  let info = filtrarFacturacionPorDia(fecha);
  let datosChart = crearObjetoChartLocalesxDia(info);
  renderChartVentasDelDia(datosChart);
}

function renderChartVentasDelDia(datosChart){
  options = {
    chart: {
      type: 'bar',
      width: '100%',
    },
    series: [{
      data: datosChart.ventas,
    }],
    xaxis: {
      categories: datosChart.locales,
      labels: {
        formatter: (valor) => monetarizar(valor),
      },
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
      enabled: true,
      formatter: (valor) => monetarizar(valor), 
      style: {
        colors: ["#444"]
      }
    },
    title: {
      text: 'Venta total de locales por día',
      align: 'center',
      offsetY: 30,
      style: {
        color: '#444',
        fontSize: "1.2em",
      }
    },
    subtitle: {
      text: rotarFecha(datosChart.fecha),
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
    grid: {
      show: true,
      borderColor: '#90A4AE',
      xaxis: {
          lines: {
              show: true
          }
      },   
    },
    tooltip: {
      enabled: false,
    },
  }
  document.querySelector("#statsChart").innerHTML = "";
  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}