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
    // testAdjust
    let hoy = new Date("2024-07-28");
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
  return {locales, ventas};
}

// ---- Eventos -----
window.addEventListener("load", () => {
  let info = filtrarFacturacionPorDia();
  let datosChart = crearObjetoChartLocalesxDia(info);
  iniciarChartVentasDelDia(datosChart);
});

// ---- Funciones ----
function iniciarChartVentasDelDia(datosChart){
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
      text: 'Ventas por local',
      align: 'center',
      offsetY: 30,
      style: {
        color: '#444',
        fontSize: "1.2em",
      }
    },
    subtitle: {
      text: fecha,
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
  
  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}