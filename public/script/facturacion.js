let contador = 0;
let numerador = 1;
const itemsfacturacion = document.querySelector("#itemsfacturacion");
document.querySelector("#gastosFecha").valueAsDate = new Date();
let formulario = document.querySelector("#nuevaVenta");

let neto = 0;
let netoiva10 = 0;
let iva10 = 0;
let netoiva21 = 0;
let iva21 = 0;
let total = 0;
let detalles = [];
let FDP = {};
let vuelto = 0;
let pago = 0;

// Creacion de botones

function crearBotonesRapidos() {
  if(botones.length == 0){
    return
  }
  let contenedor = document.querySelector("#factBotonesRapidos");
  botones.forEach((boton) => {
    let prodInfo = productos.find((prod) => prod.codigo == boton.codigo);
    if (prodInfo == undefined) {
      return;
    }
    contenedor.innerHTML += `<div class="factBotonRapido" data-id="${prodInfo.id}" data-codigo="${prodInfo.codigo}" data-cantidad="${boton.cantidad}" style="order: ${boton.orden};">
                <img src="/${prodInfo.img}">
                <span class="factBotonTxt"><h1>${prodInfo.nombre}</h1><h2>${boton.detalle}</h2></span>
                </div>`;
  });
}

crearBotonesRapidos();

function crearBotonesPers() {
  if(botonesPersonalizados.length == 0){
    return
  }
  let contenedor = document.querySelector("#factBotonesPersonalizados");
  botonesPersonalizados.forEach((boton) => {
    contenedor.innerHTML += `<div class="factBotonPersRapido" data-id="${boton.id}"  data-codigo="${boton.codigo}" data-cantidad="1" style="order: ${boton.orden};">
      <h1>${boton.nombre}</h1>
      <h2>${boton.descripcion}</h2>
    </div>`;
  });
}

crearBotonesPers();

function itemsCreador(cantidad) {
  if (isNaN(cantidad)) {
    cantidad = cantidad.target.dataset.cantidad;
  }
  for (let i = 0; i < cantidad; i++) {
    let fila = document.createElement("tr");
    fila.setAttribute("id", `fila${numerador}`);
    fila.innerHTML = `<td><input type="text" id="cod${numerador}" class="cod" data-item="${numerador}"></td>
            <td id="nom${numerador}" class="nombres"></td>
            <td><input type="number" id="cant${numerador}" value="0" class="cant" data-item="${numerador}" min="1"></td>
            <td id="med${numerador}" class="medidas"></td>
            <td><input type="text" id="precio${numerador}" data-item="${numerador}" value="$0" class="precio tablaCeldaNumero"></td>
            <td id="subVer${numerador}" class="subtotales tablaCeldaNumero">$0</td>
            <td><span class="btn eliminarItem" data-item="${numerador}">X</span></td>`;
    itemsfacturacion.appendChild(fila);
    contador++;
    numerador++;
  }
  eventos();
}

itemsCreador(7);

function cargarItem(e) {
  let producto;
  if (e.target.value >= 100) {
    producto = productos.find((prod) => prod.codigo == e.target.value);
    if (producto == undefined) {
      mostrarError(`Item ${e.target.value} inexistente`);
      vaciarItem(e);
      return;
    }
  } else {
    producto = botonesPersonalizados.find((prod) => prod.codigo == e.target.value);
    if (producto == undefined) {
      mostrarError(`Item ${e.target.value} inexistente`);
      vaciarItem(e);
      return;
    }
    producto.fraccionamiento = "unidad";
    producto.preciounidad = producto.precio;
  }
  let item = e.target.dataset.item;
  let nombre = document.querySelector(`#nom${item}`);
  let medida = document.querySelector(`#med${item}`);
  let precio = document.querySelector(`#precio${item}`);
  let cantidad = document.querySelector(`#cant${item}`);

  nombre.innerHTML = producto.nombre;
  medida.innerHTML = producto.fraccionamiento;
  if (producto.fraccionamiento === "kilo") {
    medida.innerHTML = "gramos";
    precio.value = "$" + producto.preciokilo;
    // cantidad.setAttribute("step", "1");
    // cantidad.setAttribute("min", "1");
  } else {
    precio.value = "$" + producto.preciounidad;
    // cantidad.removeAttribute("step");
  }

  if (producto.fraccionamiento !== "manual") {
    precio.classList.add("inputBloqueado");
  } else {
    precio.classList.remove("inputBloqueado");
    precio.removeEventListener("keydown", bloquearInput);
  }

  eventos();
  calcularItem(e);
}

function calcularItem(e) {
  let item = e.target.dataset.item;

  let precio = document.querySelector(`#precio${item}`);
  let precioArray = precio.value.split("$");
  if (precioArray.length < 2) {
    precio.value = "$" + precio.value;
  }
  precioArray = precio.value.split("$");
  if (precioArray[0] !== "" || isNaN(parseInt(precioArray[1]))) {
    mostrarError(`Ingresar un precio válido`);
    vaciarItem(e);
    return;
  }

  let codigo = document.querySelector(`#cod${item}`);

  let producto;
  if (codigo.value >= 100) {
    producto = productos.find((prod) => prod.codigo == codigo.value);
    if (producto === undefined) {
      return;
    }
  } else {
    producto = botonesPersonalizados.find((prod) => prod.codigo == codigo.value);
    if (producto === undefined) {
      return;
    }
    producto.fraccionamiento = "unidad";
    producto.preciounidad = producto.precio;
  }

  let cantidad = document.querySelector(`#cant${item}`);
  let subtotalVisible = document.querySelector(`#subVer${item}`);

  let calculo;
  if (producto.fraccionamiento === "unidad") {
    calculo = producto.preciounidad * cantidad.value;
  } else if (producto.fraccionamiento === "kilo") {
    calculo = producto.preciokilo * cantidad.value / 1000;
  } else if (producto.fraccionamiento === "docena") {
    let medida = document.querySelector(`#med${item}`);
    if (cantidad.value < 12) {
      medida.innerHTML = "unidad";
    } else if (cantidad.value % 12 == 0) {
      medida.innerHTML = "docena";
    } else {
      medida.innerHTML = "doc/uni";
    }
    calculo = producto.preciounidad * (cantidad.value % 12);
    calculo += producto.preciodocena * Math.trunc(cantidad.value / 12);
  } else if (producto.fraccionamiento === "manual") {
    calculo = precio.value.split("$")[1] * cantidad.value;
  } else {
    return;
  }

  if (isNaN(calculo)) {
    vaciarItem(e);
    return;
  }

  calculo = Math.round(calculo * 100) / 100;

  subtotalVisible.innerHTML = "$" + calculo;

  let detalle = [
    parseInt(item),
    calculo,
    producto.iva,
    producto.codigo,
    parseFloat(cantidad.value),
    producto.id,
  ];

  calcularTotal(detalle);
}

function calcularTotal(detalle) {
  let itemExistente = detalles.findIndex((item) => item[0] === detalle[0]);
  if (detalle[1] !== 0) {
    if (itemExistente < 0) {
      detalles.push(detalle);
    } else {
      detalles.splice(itemExistente, 1);
      detalles.push(detalle);
    }
  }
  let netoiva10Acumulador = 0;
  let iva10Acumulador = 0;
  let netoiva21Acumulador = 0;
  let iva21Acumulador = 0;
  let totalAcumulador = 0;

  detalles.forEach((item) => {
    // console.log(item)
    totalAcumulador += item[1];
    if (item[2] == 105) {
      let neto = item[1] / (1 + item[2] / 1000);
      netoiva10Acumulador += neto;
      iva10Acumulador += neto * (item[2] / 1000);
    } else if (item[2] == 210) {
      let neto = item[1] / (1 + item[2] / 1000);
      netoiva21Acumulador += neto;
      iva21Acumulador += neto * (item[2] / 1000);
    }
  });

  total = Math.round(totalAcumulador * 100) / 100;
  netoiva10 = Math.round(netoiva10Acumulador * 100) / 100;
  iva10 = Math.round(iva10Acumulador * 100) / 100;
  netoiva21 = Math.round(netoiva21Acumulador * 100) / 100;
  iva21 = Math.round(iva21Acumulador * 100) / 100;
  neto = totalAcumulador - iva10Acumulador - iva21Acumulador;
  neto = Math.round(neto * 100) / 100;

  mostrarTotal();
}

function mostrarTotal() {
  document.querySelector("#neto").innerHTML = "$" + neto;
  document.querySelector("#iva10").innerHTML = "$" + iva10;
  document.querySelector("#iva21").innerHTML = "$" + iva21;
  document.querySelector("#total").innerHTML = "$" + total;

  document.querySelector("#netoHide").value = neto;
  document.querySelector("#netoiva10Hide").value = netoiva10;
  document.querySelector("#iva10Hide").value = iva10;
  document.querySelector("#netoiva21Hide").value = netoiva21;
  document.querySelector("#iva21Hide").value = iva21;
  document.querySelector("#totalHide").value = total;
  document.querySelector("#vueltoTotal").innerHTML = "$" + total;
  document.querySelector("#datosHide").value = JSON.stringify(detalles);
}

function vaciarItem(e) {
  let item = e.target.dataset.item;
  document.querySelector(`#cod${item}`).value = "";
  document.querySelector(`#nom${item}`).innerHTML = "";
  document.querySelector(`#med${item}`).innerHTML = "";
  document.querySelector(`#cant${item}`).value = "0";
  document.querySelector(`#precio${item}`).value = "$0";
  document.querySelector(`#subVer${item}`).innerHTML = "$0";
  // document.querySelector(`#estado${item}`).value = "false";

  // let itemExistente = detalles.findIndex((dato) => dato[0] === item);
  detalles.splice(item, 1);
  calcularTotal([item, 0, 0]);
}

function eliminarItem(e) {
  let item = e.target.dataset.item;
  let fila = document.querySelector(`#fila${item}`);
  fila.remove();
  let itemExistente = detalles.findIndex((dato) => dato[0] == item);
  detalles.splice(itemExistente, 1);
  contador--;
  calcularTotal([item, 0, 0]);
  if (contador < 1) {
    itemsCreador(1);
    return;
  }
}

function bloquearInput(e) {
  e.preventDefault();
}

function mostrarError(info) {
  let mensaje = `<div class="mensajeErrorForm"><span>${info}</span><span id="timeBar"></span></div>`;
  document.querySelector("#errores").innerHTML = mensaje;
  document
    .querySelector(".mensajeErrorForm")
    .addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}

function mostrarInfo(info) {
  let mensaje = `<div class="mensajeInfo"><span>${info}</span><span id="timeBar"></span></div>`;
  document.querySelector("#errores").innerHTML = mensaje;
  document
    .querySelector(".mensajeInfo")
    .addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}

function cerrarInfo(){

}

async function vaciarFormulario() {
  if (window.data !== "") {
    if (window.data.tipo === "S") {
      window.location.href = "/panel/facturacion/registros";
      return;
    }
  }
  //   eliminar campos extra, dejar 7 inputs
  itemsfacturacion.innerHTML = "";
  contador = 0;
  numerador = 1;
  itemsCreador(7);
  document.querySelectorAll(".nombres").forEach((elem) => {
    elem.innerHTML = "";
  });
  document.querySelectorAll(".medidas").forEach((elem) => {
    elem.innerHTML = "";
  });
  document.querySelectorAll(".subtotales").forEach((elem) => {
    elem.innerHTML = "$0";
  });
  document.querySelector("#vuelto").innerHTML = "$0";
  document.querySelector("#vueltoTotal").innerHTML = "$0";

  document.querySelector("#neto").innerHTML = "$0";
  document.querySelector("#iva10").innerHTML = "$0";
  document.querySelector("#iva21").innerHTML = "$0";
  document.querySelector("#total").innerHTML = "$0";

  document.querySelector("#netoHide").value = 0;
  document.querySelector("#netoiva10Hide").value = 0;
  document.querySelector("#iva10Hide").value = 0;
  document.querySelector("#netoiva21Hide").value = 0;
  document.querySelector("#iva21Hide").value = 0;
  document.querySelector("#totalHide").value = 0;
  document.querySelector("#vueltoTotal").innerHTML = "$" + 0;
  document.querySelector("#datosHide").value = "";
  document.querySelector("#cuit").value = "";
  document.querySelector("#tipo").value = "X";
  document.querySelector("#vueltoHide").value = 0;

  neto = 0;
  iva10 = 0;
  iva21 = 0;
  total = 0;
  detalles = [];

  document.querySelector("#facturacionDetalles").style.display = "none";
  document.querySelector("#btnSenia").style.display = "none";
  formulario.reset();
  document.querySelector("#gastosFecha").valueAsDate = new Date();

  document.querySelector("#formaDePago").value = "efectivo";
  document.querySelector("#pagoMultiple").value = "";

  document.querySelector("#preloadSenia").style.display = "none";
  document.querySelector("#preloadSenia").innerHTML = "";
  document.querySelector("#seniaHiden").value = 0;

  document.querySelector("#vueltoPago").readOnly = false;

  window.location.URLSearchParams = "";

  impresionOff();
  factAOcultar();
  vaciarMontosFDP();
  crearFDP();
  ocultarMontosInputFDP();
}

function cerrarFacturacionDetalles() {
  document.querySelector("#facturacionDetalles").style.display = "none";
}

function buscarMismoItem(codigo) {
  let inputs = document.querySelectorAll(".cod");
  for (let i = 0; i < contador - 1; i++) {
    if (inputs[i].value === codigo) {
      // console.log(inputs[i])
      return inputs[i];
    }
  }
}

function buscarInputVacio() {
  let inputs = document.querySelectorAll(".cod");
  for (let i = 0; i < contador - 1; i++) {
    if (inputs[i].value === "") {
      return inputs[i];
    }
  }
}

function buscarInputCargado() {
  let inputs = document.querySelectorAll(".cod");
  for (let i = 0; i < contador - 1; i++) {
    if (inputs[i].value !== "") {
      return inputs[i];
    }
  }
}

function cargarBotonRapido(e) {
  let itemCargado = buscarMismoItem(e.currentTarget.dataset.codigo);
  let codigo;
  let medida;
  if (itemCargado !== undefined) {
    medida = document.querySelector(`#med${itemCargado.dataset.item}`).innerHTML;
  }
  if (itemCargado !== undefined && medida !== "manual") {
    let cantidadPrevia = parseFloat(
      document.querySelector(`#cant${itemCargado.dataset.item}`).value
    );
    let nuevaCantidad = parseFloat(e.currentTarget.dataset.cantidad);
    let total = cantidadPrevia + nuevaCantidad;
    document.querySelector(`#cant${itemCargado.dataset.item}`).value = total;
    codigo = itemCargado;
    document.querySelector(`#cant${itemCargado.dataset.item}`).focus()
  } else {
    let idLibre = buscarInputVacio();
    if (idLibre === undefined) {
      itemsCreador(1);
      cargarBotonRapido(e);
      return;
    }
    codigo = document.querySelector(`#cod${idLibre.dataset.item}`);
    codigo.value = e.currentTarget.dataset.codigo;
    codigo.setAttribute("data-id", e.currentTarget.dataset.id)
    document.querySelector(`#cant${idLibre.dataset.item}`).value = e.currentTarget.dataset.cantidad;
    document.querySelector(`#cant${idLibre.dataset.item}`).focus();
  }
  let event = new Event("change");
  codigo.dispatchEvent(event);
}

async function enviarFactura(tipo) {
  // verificar estado de caja previo registro
  let estadoCaja = await fetch("/panel/local/caja/api", {
    method: "POST",
    body: {},
  });
  estadoCaja = await estadoCaja.json();
  if(estadoCaja.error){
    mostrarError("Caja cerrada, abra un nueva caja para operar");
    document.querySelector("#cortinaLoad").style.display = "none";
    return;
  }

  if (tipo === "CAE") {
    if (window.impuestos === "responsable") {
      document.querySelector("#tipo").value = "6";
    } else if (window.impuestos === "monotributista") {
      document.querySelector("#tipo").value = "11";
    }
  }
  if (tipo === "A") {
    if (window.impuestos === "responsable") {
      document.querySelector("#tipo").value = "1";
      // validarCuit
    } else if (window.impuestos === "monotributista") {
      mostrarInfo("Operación inválida");
      return;
    }
  }
  document.querySelector("#cortinaLoad").style.display = "flex";
  // verificar que haya items cargados
  if (buscarInputCargado() === undefined) {
    document.querySelector("#facturacionDetalles").style.display = "none";
    mostrarError("No hay items para facturar");
    document.querySelector("#cortinaLoad").style.display = "none";
    return;
  }
  // verificar monto del pago
  if(tipo !== "S"){
    if(vuelto < 0 && pago > 0){
      mostrarError("El monto abonado no cubre el total de la factura");
      document.querySelector("#cortinaLoad").style.display = "none";
      return;
      } 
  }
  // Si el pago es multiple el monto no puede generar vuelto
  if(document.querySelector("#formaDePago").value === "multiple"){
    if(vuelto > 0){
      mostrarError("El monto total abonado en pagos multiples no puede ser mayor al monto del ticket");
      document.querySelector("#cortinaLoad").style.display = "none";
      return;
    } else if(vuelto < 0){
      mostrarError("El monto abonado no cubre el total de la factura");
      document.querySelector("#cortinaLoad").style.display = "none";
      return;
    }
  }
  // verificar que solo "efectivo" en pago multiple exceda el valor de la operacion, y que no haya montos negativos
  if(FDP.montocredito > total || FDP.montodebito > total || FDP.montovirtual > total){
    mostrarError("El monto total abonado en pagos multiples no puede ser mayor al monto del ticket");
    document.querySelector("#cortinaLoad").style.display = "none";
    return;
  }
  if(FDP.montoefectivo < 0 || FDP.montodebito < 0 || FDP.montocredito < 0 || FDP.montovirtual < 0){
    mostrarError("El monto abonado no puede ser negativo");
    document.querySelector("#cortinaLoad").style.display = "none";
    return;
  }
  // POST via fetch
  const dataBody = new URLSearchParams(new FormData(formulario));
  let resp = await fetch("/panel/facturacion", {
    method: "POST",
    body: dataBody,
  });
  resp = await resp.json();
  // console.log(resp);
  if (resp.resultado) {
    // cambiar estado de seña
    if (window.data !== "") {
      if (window.data.tipo === "S") {
        await fetch(
          `/panel/facturacion/registros/senias/actualizar?id=${window.data.id}&accion=registrar`,{method: "GET",}
        );
      }
    }
    mostrarInfo("Operación registrada");
    
    if (resp.imprimir) {
      let ticket;
      if(resp.tipo === "x"){
        ticket = await crearComprobanteComanda(resp.numero);
      } else if(resp.tipo == "CAE"){
        ticket = await crearComprobanteCAE(resp.numero);
      } else if(resp.tipo === "s"){
        ticket = await crearComprobanteSenia(resp.numero);
      }
      if(ticket.error){
        mostrarError(ticket.error);
        return
      }
      document.querySelector("#factTickets").innerHTML = ticket;
      if(resp.tipo == "CAE"){
        crearQR(QRstring);
      }
      setTimeout(() => {window.print()}, 500);
      // abrir popup con ticket
      // window.open(`/panel/facturacion/comprobante?id=${resp.numero}`);
    } else {
      vaciarFormulario();
    }
  } else {
    // console.log("ping error 1")
    mostrarError(resp.error);
  }
  document.querySelector("#cortinaLoad").style.display = "none";

  // formulario.submit()
}

window.addEventListener("afterprint", vaciarFormulario);

function registrarSeña() {
  // cambiar tipo de factura a S, registrar NF
  // modificar tipo
  document.querySelector("#tipo").value = "S";
  // cargar monto de la seña
  let montoSenia = document.querySelector("#vueltoPago").value;
  document.querySelector("#seniaHiden").value = montoSenia;
  document.querySelector("#imprimir").value = "true";
  // enviar Formulario
  enviarFactura("S");
}

// Botones

/* document.querySelector("#cuit").addEventListener("keydown", (e) => {checkCuitInput(e)});
document.querySelector("#cuit").addEventListener("focusout", (e) => {checkCuitNumero(e)}); */
document.querySelector("#limpiarFacturacion").addEventListener("click", () => {
  vaciarFormulario();
});
document.querySelector("#resetFacturacion").addEventListener("click", () => {
  cerrarFacturacionDetalles();
});
document.querySelectorAll(".factBotonRapido").forEach((boton) => {
  boton.addEventListener("click", (e) => {
    cargarBotonRapido(e);
  });
});
if(document.querySelectorAll(".factBotonPersRapido") !== null){
  document.querySelectorAll(".factBotonPersRapido").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      cargarBotonRapido(e);
    });
  });
}
document.querySelector("#enviarFacturacion").addEventListener("click", () => {
  document.querySelector("#facturacionDetalles").style.display = "flex";
  document.querySelector("#vueltoPago").focus();
  eventoVuelto();
});
document.querySelector("#enviarRegistro").addEventListener("click", () => {
  enviarFactura("X");
});
document.querySelector("#registrarFacturacion").addEventListener("click", () => {
  enviarFactura("CAE");
});
document.querySelector("#registrarFacturacionA").addEventListener("click", () => {
  enviarFactura("A");
});

document.querySelector("#confirmarImpresion").addEventListener("click", (e) => {
  if (e.target.dataset.estado === "off") {
    impresionOn();
  } else {
    impresionOff();
  }
});
const impresionOn = () => {
  const boton = document.querySelector("#confirmarImpresion");
  boton.classList.remove("off");
  boton.classList.remove("btnVerdeOutline");
  boton.classList.add("btnVerde");
  boton.dataset.estado = "on";
  document.querySelector("#confirmarImpresion > span").innerHTML = "&#10003;";
  document.querySelector("#imprimir").value = "true";
};
const impresionOff = () => {
  const boton = document.querySelector("#confirmarImpresion");
  boton.classList.add("off");
  boton.classList.add("btnVerdeOutline");
  boton.classList.remove("btnVerde");
  boton.dataset.estado = "off";
  document.querySelector("#confirmarImpresion > span").innerHTML = "&#10006;";
  document.querySelector("#imprimir").value = "false";
};

document.querySelector("#vueltoPago").addEventListener("change", (e) => {
  calcularVuelto(e);
  return;
});

document.querySelector("#vueltoPago").addEventListener("keyup", (e) => {
  calcularVuelto(e);
  return;
});

function calcularVuelto(e) {
  let senia = 0;
  let valorEvento = 0;
  if(!isNaN(parseFloat(e.target.value))){
    valorEvento = parseFloat(e.target.value);
  }
  if (document.querySelector("#preloadSeniaMonto") != null) {
    let txt = document.querySelector("#preloadSeniaMonto").innerHTML;
    senia = parseFloat(txt.slice(1, txt.length));
  }
  vuelto = valorEvento - parseFloat(total) + senia;
  pago = document.querySelector("#vueltoPago").value;
  document.querySelector("#vuelto").innerHTML = "$" + (vuelto || 0);
  document.querySelector("#vueltoHide").value = vuelto || 0;
  let FDPcargada = document.querySelector("#formaDePago").value;
  if (vuelto < 0 && valorEvento > 0 && FDPcargada !== "multiple") {
    document.querySelector("#btnSenia").style.display = "flex";
  } else {
    document.querySelector("#btnSenia").style.display = "none";
    document.querySelector("#nombresenia").value = "";
  }
  
  FDP.vueltoefectivo = vuelto;
  FDP.totalpago = pago;
}

document.querySelector("#tomarSenia").addEventListener("click", () => {
  registrarSeña();
});

document.querySelector("#backHome").addEventListener("click", () => {
  window.location.href = "/panel";
});
if (document.querySelector("#btnFactA") != null) {
  document.querySelector("#btnFactA").addEventListener("click", () => {
    factAMostrar();
  });
}

const factAMostrar = () => {
  document.querySelector("#inputCuit").style.display = "flex";
  document.querySelector("#factBotonera").style.display = "none";
  document.querySelector("#resetFacturacion").style.display = "none";
  document.querySelector("#imprimir").value = "true";
  impresionOn();
};

const factAOcultar = () => {
  document.querySelector("#inputCuit").style.display = "none";
  document.querySelector("#factBotonera").style.display = "flex";
  document.querySelector("#resetFacturacion").style.display = "block";
  document.querySelector("#cuit").value = "";
  document.querySelector("#imprimir").value = "false";
  impresionOff();
};

document.querySelector("#resetFacturacionA").addEventListener("click", () => {
  factAOcultar();
});

// Crear forma de pago
document.querySelectorAll(".FDP").forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    const forma = e.target.dataset.fdp;
    FDP[forma] = !FDP[forma];
    let FDPArray = [];
    for (item in FDP) {
      if (FDP[item] === true) {
        FDPArray.push(item);
      }
    }
    if (FDPArray.length == 0) {
      document.querySelector("#vueltoPago").readOnly = false;
      document.querySelector("#formaDePago").value = "";
      vaciarMontosFDP();
      ocultarMontosInputFDP();
      eventoVuelto();
      let click = new Event("click");
      document.querySelector("#FDPefectivo").dispatchEvent(click);
      document.querySelector("#FDPefectivo").checked = true;
    } else if (FDPArray.length > 1) {
      document.querySelector("#vueltoPago").readOnly = true;
      pasarPagoAEfectivo();
      document.querySelector("#formaDePago").value = "multiple";
      cargarMontosFDP();
      mostrarMontosInputFDP();
      cargarVuelto()
      eventoVuelto();
      document.querySelector("#pagoMultiple").value = JSON.stringify(FDP);
    } else {
      await pasarPMaPago();
      document.querySelector("#formaDePago").value = FDPArray[0];
      vaciarMontosFDP();
      ocultarMontosInputFDP();
      document.querySelector("#vueltoPago").value = "";
      document.querySelector("#vueltoPago").readOnly = false;
      eventoVuelto();
    }
  });
});

function cargarVuelto(){
  let total = 0;
  for (item in FDP) {
    if (FDP[item] === true) {  
      total += FDP[`monto${item}`];
    }
  }
  document.querySelector("#vueltoPago").value = total;
}

function pasarPagoAEfectivo(){
  let monto = document.querySelector("#vueltoPago").value
  let FDPsimple = document.querySelector("#formaDePago").value;
  if(monto !== "" && monto > 0 && FDPsimple !== "multiple"){
    document.querySelector(`#PM${FDPsimple}`).value = monto;
  }
}

async function pasarPMaPago(){
  for (item in FDP) {
    if (FDP[item] === true) {
      document.querySelector("#vueltoPago").value = FDP[`monto${item}`];
    }
  }
}

function crearFDP() {
  FDP = {};
  FDP = {
    efectivo: true,
    montoefectivo: 0,
    debito: false,
    montodebito: 0,
    credito: false,
    montocredito: 0,
    virtual: false,
    montovirtual: 0,
    vueltoefectivo: 0,
  };
}

crearFDP();

function vaciarMontosFDP() {
  FDP.montoefectivo = 0;
  FDP.montodebito = 0;
  FDP.montocredito = 0;
  FDP.montovirtual = 0;
  FDP.vueltoefectivo = 0;
  FDP.totalpago = 0;
  document.querySelector("#PMefectivo").value = 0;
  document.querySelector("#PMdebito").value = 0;
  document.querySelector("#PMcredito").value = 0;
  document.querySelector("#PMvirtual").value = 0;
  // document.querySelector("#vueltoPago").value = "";
}

function cargarMontosFDP() {
  FDP.montoefectivo = parseFloat(document.querySelector("#PMefectivo").value);
  FDP.montodebito = parseFloat(document.querySelector("#PMdebito").value);
  FDP.montocredito = parseFloat(document.querySelector("#PMcredito").value);
  FDP.montovirtual = parseFloat(document.querySelector("#PMvirtual").value);
  FDP.vueltoefectivo = parseFloat(vuelto);
  FDP.totalpago = parseFloat(pago);
  // cargar con 0 campos vacios (NaN)
  for(forma in FDP){
    if(isNaN(FDP[forma])){
      FDP[forma] = 0;
    }
  }
}

function mostrarMontosInputFDP() {
  for (item in FDP) {
    if (FDP[item] === true) {
      document.querySelector(`#PM${item}`).style.display = "block";
    } else if (FDP[item] === false) {
      document.querySelector(`#PM${item}`).style.display = "none";
    }
  }
}

function ocultarMontosInputFDP() {
  document.querySelector("#PMefectivo").style.display = "none";
  document.querySelector("#PMdebito").style.display = "none";
  document.querySelector("#PMcredito").style.display = "none";
  document.querySelector("#PMvirtual").style.display = "none";
}

document.querySelectorAll(".pagoMultiple").forEach((input) => {
  input.addEventListener("keyup", (e) => {
    const forma = e.target.dataset.fdp;
    FDP[forma] = parseInt(e.target.value);
    cargarMontosFDP();
    document.querySelector("#pagoMultiple").value = JSON.stringify(FDP);
    let total = sumarVueltoParciales();
    document.querySelector("#vueltoPago").value = total;
    eventoVuelto();
  });
});


function eventoVuelto() {
  let evento = new Event("change");
  document.querySelector("#vueltoPago").dispatchEvent(evento);
}

function sumarVueltoParciales() {
  let total = 0;
  total += FDP.montoefectivo;
  total += FDP.montodebito;
  total += FDP.montocredito;
  total += FDP.montovirtual;
  return total;
}

function eventos() {
  document.querySelectorAll(".agregarItems").forEach((boton) => {
    boton.addEventListener("click", itemsCreador);
  });

  document.querySelectorAll(".cod").forEach((boton) => {
    boton.addEventListener("change", cargarItem);
  });

  document.querySelectorAll(".cant").forEach((boton) => {
    boton.addEventListener("change", calcularItem);
  });

  document.querySelectorAll(".precio").forEach((boton) => {
    boton.addEventListener("change", calcularItem);
  });

  document.querySelectorAll(".eliminarItem").forEach((boton) => {
    boton.addEventListener("click", eliminarItem);
  });

  document.querySelectorAll(".inputBloqueado").forEach((boton) => {
    boton.addEventListener("keydown", bloquearInput);
  });
}
eventos();

if (window.data) {
  let itemsenia = `<span>
<label>Seña</label>
<div id="preloadSeniaMonto">0</div>
</span>
<span>
<label>Saldo</label>
<div id="preloadSeniaSaldo">0</div>
</span>`;

  let detalle = JSON.parse(data.detalle);
  // verificar if detllae.length > 7 porque hay que agregar campos
  if (detalle.length > 7) {
    let camposExtra = detalle.length - 7;
    itemsCreador(camposExtra);
  }
  let change = new Event("change");
  let click = new Event("click");
  detalle.forEach((item, i) => {
    i = i + 1;
    document.querySelector(`#cod${i}`).value = item[3];
    document.querySelector(`#cod${i}`).dispatchEvent(change);
    document.querySelector(`#cant${i}`).value = item[4];
    document.querySelector(`#cant${i}`).dispatchEvent(change);
    // verificar si el item lleva precio manual y cargar precio del array
    if (document.querySelector(`#med${i}`).innerHTML == "manual") {
      let precio = item[1] / item[4];
      document.querySelector(`#precio${i}`).value = precio;
      document.querySelector(`#precio${i}`).dispatchEvent(change);
    }
  });
  document.querySelector("#enviarFacturacion").dispatchEvent(click);
  document.querySelector("#preloadSenia").style.display = "flex";
  document.querySelector("#preloadSenia").innerHTML = itemsenia;
  document.querySelector("#preloadSeniaMonto").innerHTML = "$" + data.senia;
  document.querySelector("#preloadSeniaSaldo").innerHTML = "$" + (data.total - data.senia);
  document.querySelector("#seniaHiden").value = data.senia;
  eventoVuelto();
}

document.querySelector("#btnGastos").addEventListener("click", () => {
  mostrarGastos();
})

document.querySelector("#cancelarGasto").addEventListener("click", () => {
  cerrarGastos();
})

function mostrarGastos(){
  document.querySelector("#contGastos").style.display = "flex"
};

function cerrarGastos(){
  document.querySelector("#contGastos").style.display = "none"
  document.querySelector("#gastosMonto").value = 0;
  document.querySelector("#gastosDetalles").value = "";
  document.querySelector("#gastosGasto").checked = true;
  document.querySelector("#gastosRetiro").checked = false;
  document.querySelector("#gastosFecha").valueAsDate = new Date();
};


document.querySelector("#enviarGasto").addEventListener("click", () => {
  enviarGasto();
});

async function enviarGasto(){
  // verificar estado de caja previo registro
  let estadoCaja = await fetch("/panel/local/caja/api", {
    method: "POST",
    body: {},
  });
  estadoCaja = await estadoCaja.json();
  if(estadoCaja.error){
    mostrarError("Caja cerrada");
    return cerrarGastos();
  }

  let datos = {
    movimiento: "gasto",
  }
  datos.monto = document.querySelector("#gastosMonto").value;
  datos.detalles = document.querySelector("#gastosDetalles").value;
  if(document.querySelector("#gastosRetiro").checked){
    datos.movimiento = "retiro";
  } 
  datos.fecha = document.querySelector("#gastosFecha").value;
  const dataBody = new URLSearchParams(datos);
  let resp = await fetch("/panel/facturacion/registros/gastos/nuevo", {
    method: "POST",
    body: dataBody,
  });
  resp = await resp.json();
  if(resp.resultado){
    mostrarInfo("Gasto registrado");
  } else {
    mostrarError(resp.error);
  }
  cerrarGastos();
}

window.addEventListener("resize", () => {
  redimensionar();
});
window.addEventListener("load", () => {
  redimensionar();
  // vaciarFormulario();
});

function redimensionar(){
  let scrollActivo = window.innerWidth > document.documentElement.clientWidth;
  if(scrollActivo){
    document.querySelector(".resumenFacturacion").classList.add("resumenFacturacionScroll");
    document.querySelector("#factBotoneraXtra").classList.add("factBotoneraXtraScroll");
    document.querySelector("#backRender").classList.add("factBackRenderScroll");

  } else {
    document.querySelector(".resumenFacturacion").classList.remove("resumenFacturacionScroll");
    document.querySelector("#factBotoneraXtra").classList.remove("factBotoneraXtraScroll");
    document.querySelector("#backRender").classList.remove("factBackRenderScroll");
  }
}

async function consultarPadron(){
  // let data = {idPersona: e.target.value};
  let data = {idPersona: document.querySelector("#cuit").value}
  const dataBody = new URLSearchParams(data);
  let consultaPadron = await fetch("/panel/facturacion/padron/api", {
    method: "POST",
    body: dataBody,
  })
  consultaPadron = await consultaPadron.json();
  if(consultaPadron.data.error){
    const boton = document.querySelector("#registrarFacturacionA")
    boton.classList.add("btnGris");
    boton.classList.remove("btnAzul");
    document.querySelector("#cuitNombre").value = "";
    mostrarError(consultaPadron.data.msg);
    return;
  } else {
    const boton = document.querySelector("#registrarFacturacionA")
    boton.classList.remove("btnGris");
    boton.classList.add("btnAzul");
    let nombre = consultaPadron.data.datosGenerales.apellido + ", " + consultaPadron.data.datosGenerales.nombre;
    document.querySelector("#cuitNombre").value = nombre;
    return;
  }
}

document.querySelector("#consultarPadron").addEventListener("click", () => {consultarPadron();})