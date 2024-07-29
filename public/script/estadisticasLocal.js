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

let ventasTotalxDia = [];
window.resumenVentas.forEach((dia) => {
    ventasTotalxDia.push(dia.totalDia);
});

let ventas = ventasTotalxDia;

let diasDelResumen = [];
window.resumenVentas.forEach((dia) => {
    diasDelResumen.push(dia.fecha);
});

let dias = diasDelResumen;

let options;
let chart;

function iniciarChart(){
  options = {
    chart: {
      type: 'bar',
      width: '100%',
    },
    series: [{
      name: 'Venta',
      data: ventas,
    }],
    yaxis: {
        labels: {
          formatter: (valor) => monetarizar(valor),
        },
      },
    xaxis: {
      categories: dias,
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

window.addEventListener("load", () => {iniciarChart()})

document.querySelectorAll(".filtrarDias").forEach((boton) => {
  boton.addEventListener("click", (e) => {
    filtrarChartDias(e.currentTarget.dataset.dias)
  })
}) 

function filtrarChartDias(dias){
  let hoy = new Date();
  hoy.setDate(hoy.getDate() - (dias - 1));
  let semana = [];
  let ventasSemana = [];
  for (let i = 0; i < (dias); i++) {
    let data = dobleDigito(hoy.getFullYear()) + "-" + dobleDigito((hoy.getMonth() + 1)) + "-"  + dobleDigito(hoy.getDate());
    semana.push(data);
    let diaIndex = diasDelResumen.findIndex((dia) => dia === data);
    if(diaIndex !== -1){
      ventasSemana.push(ventasTotalxDia[diaIndex]);
    } else {
      ventasSemana.push(0);
    }
    hoy.setDate(hoy.getDate() + 1);
  }

  document.querySelector("#statsChart").innerHTML = "";
  
  options.series[0].data = ventasSemana;
  options.xaxis.categories = semana;

  chart = new ApexCharts(document.querySelector("#statsChart"), options);
  chart.render();
}

document.querySelector("#statsVerTodo").addEventListener("click", () => {
  document.querySelector("#statsChart").innerHTML = "";
  iniciarChart();
})