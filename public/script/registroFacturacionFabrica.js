// ---- Utilidades ----
function monetarizar(valor){
  valor = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
  return valor;
}

function textoTipoFrase(texto){
  let nombreProducto = texto.toLowerCase();
  nombreProducto = nombreProducto.split(" ");
  nuevoNombre = []
  nombreProducto.forEach((palabra) => {
  nuevaPalabra = palabra[0].toUpperCase() + palabra.slice(1);
  nuevoNombre.push(nuevaPalabra);
  });
  nombreProducto = nuevoNombre.join(" ");
  return nombreProducto;
}

// ---- Eventos ----
document.querySelector("#fechaFactFabrica").addEventListener("change", (e) => {
  let fecha = e.target.value;
  fecha = fecha.replace(/-/g, "");
  window.location.href = `/panel/facturacion/fabrica?fecha=${fecha}`;
});

window.addEventListener("load", () => {
    facturacionDiaria.sort((a, b) => b.total - a.total);
    facturacionDiaria.forEach((local) => {
      local.local = textoTipoFrase(local.local);
    })
    let locales = [];
    facturacionDiaria.forEach((local) => {
        locales.push(local.local);
    });
    let ventas = [];
    facturacionDiaria.forEach((local) => {
        ventas.push(local.total);
    });
    iniciarChartVentasDelDia(locales, ventas);
});

// ---- Funciones ----
function iniciarChartVentasDelDia(x, y){
  options = {
    chart: {
      type: 'bar',
      width: '100%',
    },
    series: [{
      data: y,
    }],
    xaxis: {
      categories: x,
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
  
  chart = new ApexCharts(document.querySelector("#statsChartFabricaVentasDelDia"), options);
  chart.render();
}