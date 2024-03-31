let contador = 0;
let numerador = 1;
const itemsfacturacion = document.querySelector("#itemsfacturacion");
document.querySelector("#fecha").valueAsDate = new Date();
let formulario = document.querySelector("#nuevaVenta");

let neto = 0;
let netoiva10 = 0;
let iva10 = 0;
let netoiva21 = 0;
let iva21 = 0;
let total = 0;
let detalles = [];

// Creacion de botones

function crearBotonesRapidos(){
    let contenedor = document.querySelector("#factBotonesRapidos")
    botones.forEach((boton) => {
        let prodInfo = productos.find((prod) => prod.codigo == boton.codigo)
        if(prodInfo == undefined){return}
        contenedor.innerHTML += `<div class="factBotonRapido" data-codigo="${prodInfo.codigo}" data-cantidad="${boton.cantidad}" style="order: ${boton.orden};">
                <img src="/${prodInfo.img}">
                <span class="factBotonTxt"><h1>${prodInfo.nombre}</h1><h2>${boton.detalle}</h2></span>
                </div>`
    })
    
}

crearBotonesRapidos();
// CUIT

/* function checkCuitInput(e){
    if(e.keyCode === 8 || e.keyCode === 46){
        return;
    }
    if(isNaN(parseInt(e.key))){
        e.preventDefault();
    }
}

function checkCuitNumero(e){
    let caracteres = parseInt(e.target.value.length)
    if(caracteres == 0){
        return;
    }
    if(caracteres !== 11){
        mostrarError(`Número de CUIT ${e.target.value} inválido`);
        document.querySelector("#cuit").value = "";
        // hacer foco en elemento cuit document.querySelector("#cuit")
    }
} */

function itemsCreador(cantidad){
    if(isNaN(cantidad)){
        cantidad = cantidad.target.dataset.cantidad
    }
    for (let i = 0; i < cantidad; i++) {
        let fila = document.createElement("tr")
        fila.setAttribute("id", `fila${numerador}`)
        fila.innerHTML = `<td><input type="text" id="cod${numerador}" class="cod" data-item="${numerador}"></td>
            <td id="nom${numerador}" class="nombres"></td>
            <td><input type="number" id="cant${numerador}" value="0" class="cant" data-item="${numerador}" min="1"></td>
            <td id="med${numerador}" class="medidas"></td>
            <td><input type="text" id="precio${numerador}" data-item="${numerador}" value="$0" class="precio tablaCeldaNumero"></td>
            <td id="subVer${numerador}" class="subtotales tablaCeldaNumero">$0</td>
            <td><span class="btn eliminarItem" data-item="${numerador}">X</span></td>`;
        itemsfacturacion.appendChild(fila)
        contador++;
        numerador++;
    }
    eventos();
}

itemsCreador(7);

function cargarItem(e){
    let producto = productos.find((prod) => prod.codigo == e.target.value);
    if(producto == undefined){
        mostrarError(`Item ${e.target.value} inexistente`);
        vaciarItem(e);
        return
    }
    let item = e.target.dataset.item
    let nombre = document.querySelector(`#nom${item}`);
    let medida = document.querySelector(`#med${item}`);
    let precio = document.querySelector(`#precio${item}`);
    let cantidad = document.querySelector(`#cant${item}`);
    
    nombre.innerHTML = producto.nombre;
    medida.innerHTML = producto.fraccionamiento;
    if(producto.fraccionamiento === "kilo"){
        precio.value = "$" + producto.preciokilo;
        cantidad.setAttribute("step", "0.01")
    } else {
        precio.value = "$" + producto.preciounidad;
        cantidad.removeAttribute("step")
    }

    if(producto.fraccionamiento !== "manual"){
        precio.classList.add("inputBloqueado")
    } else {
        precio.classList.remove("inputBloqueado");
        precio.removeEventListener("keydown", bloquearInput)
    }

    eventos();
    calcularItem(e);    
}

function calcularItem(e){
    let item = e.target.dataset.item;

    let precio = document.querySelector(`#precio${item}`);
    let precioArray = precio.value.split("$");
    if(precioArray.length < 2){
        precio.value = "$" + precio.value;
    }
    precioArray = precio.value.split("$");
    if(precioArray[0] !== "" || isNaN(parseInt(precioArray[1]))){
        mostrarError(`Ingresar un precio válido`);
        vaciarItem(e);
        return;
    }

    let codigo = document.querySelector(`#cod${item}`);
    let producto = productos.find((prod) => prod.codigo == codigo.value);
    if(producto === undefined){
        return;
    }
    let cantidad = document.querySelector(`#cant${item}`);
    let subtotalVisible = document.querySelector(`#subVer${item}`);

    let calculo;
    if(producto.fraccionamiento === "unidad"){
        calculo = producto.preciounidad * cantidad.value;
    } else if(producto.fraccionamiento === "kilo"){
        calculo = producto.preciokilo * cantidad.value;
    } else if(producto.fraccionamiento === "docena"){
        let medida = document.querySelector(`#med${item}`);
        if(cantidad.value < 12){
            medida.innerHTML = "unidad";
        } else if ((cantidad.value % 12) == 0){
            medida.innerHTML = "docena";
        } else {
            medida.innerHTML = "doc/uni";
        }
        calculo = producto.preciounidad * (cantidad.value % 12);
        calculo += producto.preciodocena * (Math.trunc(cantidad.value / 12))
    } else if(producto.fraccionamiento === "manual"){
        calculo = precio.value.split("$")[1] * cantidad.value;
    } else {return}

    if(isNaN(calculo)){
        vaciarItem(e);
        return
    }

    calculo = Math.round(calculo*100)/100

    subtotalVisible.innerHTML = "$" + calculo;

    let detalle = [parseInt(item), calculo, producto.iva, producto.codigo, parseFloat(cantidad.value)];

    calcularTotal(detalle)
}

function calcularTotal(detalle){
    let itemExistente = detalles.findIndex((item) => item[0] === detalle[0]);
    if(detalle[1] !== 0){
        if(itemExistente < 0){
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
        totalAcumulador += item[1]
        if(item[2] == 105){
            let neto = item[1] / (1 + (item[2] / 1000));
            netoiva10Acumulador += neto;
            iva10Acumulador += neto * (item[2] / 1000);
        } else if(item[2] == 210){
            let neto = item[1] / (1 + (item[2] / 1000));
            netoiva21Acumulador += neto;
            iva21Acumulador += neto * (item[2] / 1000);
        }
    })

    total = Math.round(totalAcumulador*100)/100;
    netoiva10 = Math.round(netoiva10Acumulador*100)/100;
    iva10 = Math.round(iva10Acumulador*100)/100;
    netoiva21 = Math.round(netoiva21Acumulador*100)/100;
    iva21 = Math.round(iva21Acumulador*100)/100;
    neto = totalAcumulador - iva10Acumulador - iva21Acumulador;
    neto = Math.round(neto*100)/100;

    mostrarTotal();
}

function mostrarTotal(){
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
    document.querySelector("#vueltoTotal").innerHTML = "$"+total;
    document.querySelector("#datosHide").value = JSON.stringify(detalles);
}

function vaciarItem(e){
    let item = e.target.dataset.item
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

function eliminarItem(e){
    let item = e.target.dataset.item;
    let fila = document.querySelector(`#fila${item}`);
    fila.remove();
    let itemExistente = detalles.findIndex((dato) => dato[0] == item);
    detalles.splice(itemExistente, 1);
    contador--;
    calcularTotal([item, 0, 0]);
    if(contador < 1){
        itemsCreador(1);
        return
    }
}

function bloquearInput(e){
    e.preventDefault()
}

function mostrarError(info){
    let mensaje = `<div class="mensajeErrorForm"><span>${info}</span></div>`;
    document.querySelector("#errores").innerHTML = mensaje;
    document.querySelector(".mensajeErrorForm").addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}

function vaciarFormualrio(){
    document.querySelectorAll(".nombres").forEach((elem) => {
        elem.innerHTML = "";
    })
    document.querySelectorAll(".medidas").forEach((elem) => {
        elem.innerHTML = "";
    })
    document.querySelectorAll(".subtotales").forEach((elem) => {
        elem.innerHTML = "$0";
    })
    document.querySelector("#vuelto").innerHTML = "$0"
    document.querySelector("#vueltoTotal").innerHTML = "$0"

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
    document.querySelector("#vueltoTotal").innerHTML = "$"+0;
    document.querySelector("#datosHide").value = "";

    neto = 0;
    iva10 = 0;
    iva21 = 0;
    total = 0;
    detalles = [];

    document.querySelector("#facturacionDetalles").style.display = "none";
    document.querySelector("#btnSenia").style.display = "none";
    formulario.reset();
    document.querySelector("#fecha").valueAsDate = new Date();
}

function buscarMismoItem(codigo){
    let inputs = document.querySelectorAll(".cod");
    for (let i = 0; i < (contador - 1); i++) {
        if(inputs[i].value === codigo){
            // console.log(inputs[i])
            return inputs[i]
        }
    }
}

function buscarInputVacio(){
    let inputs = document.querySelectorAll(".cod");
    for (let i = 0; i < (contador - 1); i++) {
        if(inputs[i].value === ""){
            return inputs[i]
        }
    }
}

function buscarInputCargado(){
    let inputs = document.querySelectorAll(".cod");
    for (let i = 0; i < (contador - 1); i++) {
        if(inputs[i].value !== ""){
            return inputs[i]
        }
    }
}

function cargarBotonRapido(e){
    let itemCargado = buscarMismoItem(e.currentTarget.dataset.codigo);
    let codigo;
    let medida;
    if(itemCargado !== undefined){
        medida = document.querySelector(`#med${itemCargado.dataset.item}`).innerHTML;
    }
    if(itemCargado !== undefined && medida !== "manual"){
        let cantidadPrevia = parseFloat(document.querySelector(`#cant${itemCargado.dataset.item}`).value);
        let nuevaCantidad = parseFloat(e.currentTarget.dataset.cantidad);
        let total = cantidadPrevia + nuevaCantidad
        document.querySelector(`#cant${itemCargado.dataset.item}`).value = total;
        codigo = itemCargado
    } else {
        let idLibre = buscarInputVacio();
        if(idLibre === undefined){
            itemsCreador(1);
            cargarBotonRapido(e);
            return;
        }
        codigo = document.querySelector(`#cod${idLibre.dataset.item}`);
        codigo.value = e.currentTarget.dataset.codigo;
        document.querySelector(`#cant${idLibre.dataset.item}`).value = e.currentTarget.dataset.cantidad;
    }
    let event = new Event("change");
    codigo.dispatchEvent(event);
}

function enviarFactura(){
    if(buscarInputCargado() === undefined){
        document.querySelector("#facturacionDetalles").style.display = "none";
        mostrarError("No hay items para facturar");
        return;
    }
    formulario.submit()
}

function registrarSeña(total, pago){
    // cambiar tipo de factura a S, registrar NF
    // eliminar input select
    document.querySelector("#tipo").remove();
    // agregar campo Tipo
    document.querySelector("#camposOcultos").innerHTML += '<input type="hidden" name="tipo" id="tipoSenia" value="S"></input>';
    // cargar monto de la seña
    let montoSenia = document.querySelector("#vueltoPago").value;
    document.querySelector("#seniaHiden").value = montoSenia;
    // enviar Formulario
    formulario.submit()
}

// Botones

/* document.querySelector("#cuit").addEventListener("keydown", (e) => {checkCuitInput(e)});
document.querySelector("#cuit").addEventListener("focusout", (e) => {checkCuitNumero(e)}); */
document.querySelectorAll("#resetFacturacion").forEach((boton) => {
    boton.addEventListener("click", vaciarFormualrio);
});
document.querySelectorAll(".factBotonRapido").forEach((boton) => {
    boton.addEventListener("click", (e) => {cargarBotonRapido(e)})
});
document.querySelector("#enviarFacturacion").addEventListener("click", () => {
    document.querySelector("#facturacionDetalles").style.display = "flex";
    document.querySelector("#vueltoPago").focus();
});
document.querySelector("#confirmarFacturacion").addEventListener("click", () => {enviarFactura()});
document.querySelector("#confirmarFacturacionEImpresion").addEventListener("click", () => {
    document.querySelector("#imprimir").value = "true";
    enviarFactura();
});
document.querySelector("#tipo").addEventListener("change", (e) => {
    // console.log(e.target.value)
    if(e.target.value == "NC"){
        document.querySelector("#ncSpan").style.display = "flex";
    }
})
document.querySelector("#vueltoPago").addEventListener("change", (e) => {
    let vuelto = parseFloat(e.target.value) - parseFloat(total);
    document.querySelector("#vuelto").innerHTML = "$" + vuelto;
    if(vuelto < 0){
        document.querySelector("#btnSenia").style.display = "flex";
    } else {
        document.querySelector("#btnSenia").style.display = "none";

    }
})
document.querySelector("#tomarSenia").addEventListener("click", () => {registrarSeña()})

document.querySelector("#backHome").addEventListener("click", () => {
    window.location.href = "/panel"
})

function eventos(){
    document.querySelectorAll(".agregarItems").forEach((boton) => {
        boton.addEventListener("click", itemsCreador)
    })

    document.querySelectorAll(".cod").forEach((boton) => {
        boton.addEventListener("change", cargarItem)
    });

    document.querySelectorAll(".cant").forEach((boton) => {
        boton.addEventListener("change", calcularItem)
    });

    document.querySelectorAll(".precio").forEach((boton) => {
        boton.addEventListener("change", calcularItem)
    });

    document.querySelectorAll(".eliminarItem").forEach((boton) => {
        boton.addEventListener("click", eliminarItem)
    })

    document.querySelectorAll(".inputBloqueado").forEach((boton) => {
        boton.addEventListener("keydown", bloquearInput)
    })
}
eventos();