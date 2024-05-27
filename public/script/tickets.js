function monetarizar(valor) {
  if (valor < 1) {
    return "-";
  }
  valor = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(valor);
  return valor;
}

async function crearComprobanteSenia(id) {
  document.querySelector("#factTickets").style.display = "flex";
  let factura = await fetch(`/panel/facturacion/comprobante/parcial?id=${id}`, { method: "GET" });
  factura = await factura.json();
  // capturar error
  let fecha = new Date(factura.fechaevento);
  fecha = fecha.toLocaleDateString()
  let fechaHora = factura.fechaevento.split("T");
  fechaHora[1] = fechaHora[1].split(".");
  let hora = fechaHora[1][0];
  let detalle = JSON.parse(factura.detalle);
  let textoDetalles = "";
  detalle.forEach((item) => {
    let producto;
    if (item[3] >= 100) {
      producto = window.productos.find((prod) => prod.id === item[5]);
    } else {
      producto = window.botonesPersonalizados.find((prod) => prod.id === item[5]);
      producto.fraccionamiento = "unidad";
      producto.preciounidad = producto.precio;
    }
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
<span><h1>"Dulce Hora ${window.local.nombre}"</h1></span>
<span><h1>-- SEÑA --</h1></span>
<span><h3>${fecha} - ${hora}</h3></span>
<span><h3>Seña Nº ${factura.numero}</h3></span>
<span><h3>Nombre: ${observaciones.nombre}</h3></span>
<span>Detalle:</span>
<table class="tablaComanda">
    <tbody>
        ${textoDetalles}
    </tbody>
</table>
<span style="align-self: flex-end;">Total: $${factura.total}</span>
<span style="align-self: flex-end;">Seña: $${factura.senia}</span>
<span style="align-self: flex-end;">Restante: $${resto}</span><br />
<span style="text-align: center;"><h3><i>Ticket no válido como factura</i></h3></span>
</div>`;
  return comprobanteSenia;
}

async function crearComprobanteComanda(id) {
  document.querySelector("#factTickets").style.display = "flex";
  let factura = await fetch(`/panel/facturacion/comprobante?id=${id}`, { method: "GET" });
  factura = await factura.json();
  // capturar error
  let fecha = new Date(factura.fechaevento);
  fecha = fecha.toLocaleDateString()
  let fechaHora = factura.fechaevento.split("T");
  fechaHora[1] = fechaHora[1].split(".");
  let hora = fechaHora[1][0];
  let detalle = JSON.parse(factura.detalle);
  let textoDetalles = "";
  detalle.forEach((item) => {
    let producto;
    if (item[3] >= 100) {
      producto = window.productos.find((prod) => prod.id === item[5]);
    } else {
      producto = window.botonesPersonalizados.find((prod) => prod.id === item[5]);
      producto.fraccionamiento = "unidad";
      producto.preciounidad = producto.precio;
    }
   
    textoDetalles += `<tr>
            <td>${item[0]}</td>
            <td>${producto.nombre}</td>
            <td>${item[4]}</td>
            <td>$${item[1]}</td>
        </tr>`;
  });

  let condicion = "Monotributista";
  if(window.datosFiscales.condicioniva == "responsable"){
    condicion = "Responsable Inscripto"
  }

  let comprobanteComanda = `<div id="comprobante">
<span><h1>"Dulce Hora ${window.local.nombre}"</h1></span>

<span><h3>${window.datosFiscales.razonsocial}</h3></span>
<span><h3>CUIT ${window.datosFiscales.cuit}</h3></span>
<span><h3>IB: ${window.datosFiscales.iibb}</h3></span>
<span><h3>${window.datosFiscales.domiciliofiscal}</h3></span>
<span><h3>Inicio Act.: ${new Date(window.datosFiscales.inicioactividades).toLocaleDateString()}</h3></span>
<span><h3>${condicion}</h3></span>

<span><h3>${fecha} - ${hora}</h3></span>
<span><h3>Comanda Nº ${factura.numero}</h3></span>
<span>Detalle:</span>
<table class="tablaComanda">
    <tbody>
        ${textoDetalles}
    </tbody>
</table>
<span style="align-self: flex-end;">Total: $${factura.total}</span><br />
<span style="text-align: center;"><h2><b>Gracias por su compra!</b></h2></span>
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
    return factura.error;
  }
  // return
  let detalle = factura.detalle;
  detalle = JSON.parse(detalle);
  let textoDetalles = "";
  let punto = factura.ptoventa.toString().padStart(3, "0");
  let numero = factura.numero.toString().padStart(7, "0");
  let fecha = new Date(factura.fechaevento);
  fecha = fecha.toLocaleDateString();
  let fechaHora = factura.fechaevento.split("T");
  fechaHora[1] = fechaHora[1].split(".");
  let hora = fechaHora[1][0];
  let destinatario = "A Consumidor Final"
  if(factura.tipo == 1){
    destinatario = "Dest: " + factura.receptor;
  };
  let condicion = "Monotributista";
  if(window.datosFiscales.condicioniva == "responsable"){
    condicion = "Responsable Inscripto"
  }
  let tipo;
  switch (factura.tipo) {
    case 1:
      tipo = "Fact. A";
      break;
    case 6:
      tipo = "Fact. B";
      break;
    case 11:
      tipo = "Fact. C";
      break;
    case 3:
      tipo = "NC-A";
      break;
    case 8:
      tipo = "NC-B";
      break;
    case 13:
      tipo = "NC-C";
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
  if (factura.tipo == 1 || factura.tipo == 3) {
    datosParaQR.tipoDocRec = 80;
    datosParaQR.nroDocRec = factura.receptor;
  }

  detalle.forEach((item) => {
    let producto;
    if (item[3] >= 100) {
      producto = window.productos.find((prod) => prod.id === item[5]);
    } else {
      producto = window.botonesPersonalizados.find((prod) => prod.id === item[5]);
      producto.fraccionamiento = "unidad";
      producto.preciounidad = producto.precio;
    }
    let precioUnitario = parseFloat(item[1]) / parseFloat(item[4]);
    textoDetalles += `<tr>
            <td colspan="4"><b>${producto.nombre}</b></td>
          </tr>
          <tr class="tdBoderBottom">
            <td>x${item[4]}</td>
            <td>${item[2]/10}%</td>
            <td>${monetarizar(precioUnitario)}</td>
            <td>${monetarizar(item[1])}</td>
          </tr>`;
  });
 /*  let comprobanteCAE = `<div id="comprobante">
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
</div>`; */
let comprobanteCAE = `<div id="comprobante" class="comprobanteCAE">
<span><h1>"Dulce Hora ${window.local.nombre}"</h1></span>
<span><h3>${window.datosFiscales.razonsocial}</h3></span>
<span><h3>CUIT ${window.datosFiscales.cuit}</h3></span>
<span><h3>IB: ${window.datosFiscales.iibb}</h3></span>
<span><h3>${window.datosFiscales.domiciliofiscal}</h3></span>
<span><h3>Inicio Act.: ${new Date(window.datosFiscales.inicioactividades).toLocaleDateString()}</h3></span>
<span><h3>${condicion}</h3></span>
<span><h3>${destinatario}</h3></span>
<hr>
<span><h2>${fecha} - ${hora}</h2></span>
<span><h2>${tipo} ${punto}-${numero}</h2></span>
<hr>
<span>Detalle:</span>
<table>
    <tbody>
        ${textoDetalles}
    </tbody>
</table>
<span style="align-self: flex-end;"><b>Total: ${monetarizar(factura.total)}</b></span>
<hr>
<span style="text-align: center;"><h3>CAE: ${factura.CAE}</h3></span>
<div id="qrCAE"></div>
<span style="text-align: center;"><h2><b>Gracias por su compra!</b></h2></span>
</div>`;

  QRstring = await crearQRstring(datosParaQR);

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
  let datos64 = btoa(datos);
  datos64 = url + datos64;
  return datos64;
}

function crearQR(string) {
  let qrcode = new QRCode(document.getElementById("qrCAE"), {
    text: string,
    width: 1024,
    height: 1024,
    correctLevel: QRCode.CorrectLevel.M,
  });
}

function cerrarTicket() {
  document.querySelector("#factTickets").style.display = "none";
  document.querySelector("#factTickets").innerHTML = "";
}
