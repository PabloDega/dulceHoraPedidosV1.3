async function crearComprobanteSenia(id) {
  document.querySelector("#factTickets").style.display = "flex";
  let factura = await fetch(`/panel/facturacion/comprobante/parcial?id=${id}`, { method: "GET" });
  factura = await factura.json();
  // capturar error
  let detalle = factura.detalle;
  let textoDetalles = "";
  detalle.forEach((item) => {
    let producto = window.productos.find((prod) => prod.codigo === item[3]);
    textoDetalles += `<tr>
            <td>${item[0]}</td>
            <td>${producto.nombre}</td>
            <td>${item[4]}</td>
            <td>$${item[1]}</td>
        </tr>`;
  });
  let resto = factura.total - factura.senia;
  let observaciones = JSON.parse(factura.observaciones);
  let comprobanteSenia = `<div id="comprobante">
<span style="display: flex; justify-content: center;">
    <img src="/im/logoDH.png" alt="">
</span>
<span><h1>"Dulce Hora ${window.local.nombre}"</h1></span>
<span><h1>-- SEÑA --</h1></span>
<span><h3>${factura.fecha}</h3></span>
<span><h3>Seña Nº ${factura.numero}</h3></span>
<span><h3>Nombre: ${observaciones.nombre}</h3></span>
<span>Detalle:</span>
<table>
    <tbody>
        ${textoDetalles}
    </tbody>
</table>
<span style="align-self: flex-end;">Total: $${factura.total}</span>
<span style="align-self: flex-end;">Seña: $${factura.senia}</span>
<span style="align-self: flex-end;">Restante: $${resto}</span>
<span style="text-align: center;"><h3><i>Ticket no válido como factura</i></h3></span>
</div>`;
  return comprobanteSenia;
}

async function crearComprobanteComanda(id) {
  document.querySelector("#factTickets").style.display = "flex";
  let factura = await fetch(`/panel/facturacion/comprobante?id=${id}`, { method: "GET" });
  factura = await factura.json();
  // capturar error
  let detalle = factura.detalle;
  let textoDetalles = "";
  detalle.forEach((item) => {
    let producto = window.productos.find((prod) => prod.codigo === item[3]);
    textoDetalles += `<tr>
            <td>${item[0]}</td>
            <td>${producto.nombre}</td>
            <td>${item[4]}</td>
            <td>$${item[1]}</td>
        </tr>`;
  });
  let comprobanteComanda = `<div id="comprobante">
<span style="display: flex; justify-content: center;">
    <img src="/im/logoDH.png" alt="">
</span>
<span><h1>"Dulce Hora ${window.local.nombre}"</h1></span>
<span><h3>${factura.fecha}</h3></span>
<span><h3>Comanda Nº ${factura.numero}</h3></span>
<span>Detalle:</span>
<table>
    <tbody>
        ${textoDetalles}
    </tbody>
</table>
<span style="align-self: flex-end;">Total: $${factura.total}</span>
<span style="text-align: center;"><h3><i>Ticket no válido como factura</i></h3></span>
</div>`;
  return comprobanteComanda;
}

let QRstring;

async function crearComprobanteCAE(id) {
  document.querySelector("#factTickets").style.display = "flex";
  let factura = await fetch(`/panel/facturacion/comprobante/fiscal?id=${id}`, { method: "GET" });
  factura = await factura.json();
  // capturar error
  if (factura.error) {
    console.log("ping");
    return factura.error;
  }
  // return
  let detalle = factura.detalle;
  detalle = JSON.parse(detalle);
  let textoDetalles = "";
  let punto = factura.ptoventa.toString().padStart(3, "0");
  let numero = factura.numero.toString().padStart(7, "0");
  let fechaHora = factura.fechaevento.split("T");
  fechaHora[1] = fechaHora[1].split(".");
  let tipo;
  switch (factura.tipo) {
    case 1:
      tipo = "A";
      break;
    case 6:
      tipo = "B";
      break;
    case 11:
      tipo = "C";
      break;
    case 8:
      tipo = "NC";
      break;
    default:
      break;
  }

  // Crea datos para el QR
  let datosParaQR = {
    fecha: fechaHora[0],
    cuit: factura.cuitemisor,
    ptoVta: factura.ptoventa,
    tipoCmp: factura.tipo,
    nroCmp: factura.numero,
    importe: factura.total,
    codAut: factura.CAE,
  };
  if (factura.tipo == 1) {
    datosParaQR.tipoDocRec = 80;
    datosParaQR.nroDocRec = factura.receptor;
  }
  QRstring = await crearQRstring(datosParaQR);

  detalle.forEach((item) => {
    let producto = window.productos.find((prod) => prod.codigo === item[3]);
    textoDetalles += `<tr>
            <td>${item[0]}</td>
            <td>${producto.nombre}</td>
            <td>${item[4]}</td>
            <td>$${item[1]}</td>
        </tr>`;
  });
  let comprobanteCAE = `<div id="comprobante">
<span style="display: flex; justify-content: center;">
    <img src="/im/logoDH.png" alt="">
</span>
<span><h1>"Dulce Hora ${window.local.nombre}"</h1></span>
<span><h3>CUIT ${factura.cuitemisor}</h3></span>
<span><h3>${fechaHora[0]} - ${fechaHora[1][0]}</h3></span>
<span><h4>Fact. ${tipo} ${punto}-${numero}</h4></span>
<span>Detalle:</span>
<table>
    <tbody>
        ${textoDetalles}
    </tbody>
</table>
<span style="align-self: flex-end;">Total: $${factura.total}</span>
<span style="text-align: center;"><h3>CAE: ${factura.CAE}</h3></span>
<div id="qrCAE"></div>
</div>`;
  return comprobanteCAE;
}

window.addEventListener("afterprint", () => {
  cerrarTicket();
});

async function crearQRstring(datos) {
  datos.moneda = "PES";
  datos.ctz = 1;
  datos.tipoCodAut = "E";
  datos.ver = 1;
  datos = JSON.stringify(datos);
  let url = "https://www.afip.gob.ar/fe/qr/?p=";
  let datos64 = btoa(JSON.stringify(datos));
  datos64 = url + datos64;
  console.log(datos64);
  return datos64;
}

function crearQR(string) {
  let qrcode = new QRCode(document.getElementById("qrCAE"), {
    text: string,
    width: 1024,
    height: 1024,
    correctLevel : QRCode.CorrectLevel.M,
  });
}

function cerrarTicket() {
  document.querySelector("#factTickets").style.display = "none";
  document.querySelector("#factTickets").innerHTML = "";
}
