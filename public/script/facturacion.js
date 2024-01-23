let contador = 1;
const itemsfacturacion = document.querySelector("#itemsfacturacion");
document.querySelector("#fecha").valueAsDate = new Date();

 /* function cargarFecha(){
   let f = new Date()
    let g = f.getTimezoneOffset()
    let h = new Date().getHours()
    f.setHours(h - (g / 60));
    f = f.toISOString();
    f = f.split(".");
    fecha.value = f[0]; 
}*/

// CUIT

function checkCuitInput(e){
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
        mostrarError(`Número de CUIT inválido`);
    }
}

function itemsCreador(cantidad){
    if(isNaN(cantidad)){
        cantidad = cantidad.target.dataset.cantidad
    }
    for (let i = 0; i < cantidad; i++) {
        let fila = document.createElement("tr")
        fila.setAttribute("id", `fila${contador}`)
        fila.innerHTML = `<td id="item${contador}">${contador}</td>
            <td><input type="text" id="cod${contador}" class="cod" data-item="${contador}"></td>
            <td id="nom${contador}" class="nombres"></td>
            <td><input type="number" id="cant${contador}" value="0" class="cant" data-item="${contador}" min="0"></td>
            <td id="med${contador}" class="medidas"></td>
            <td><input type="text" id="precio${contador}" data-item="${contador}" value="$0" class="precio"></td>
            <td id="iva${contador}">$0</td>
            <td id="subVer${contador}" class="subtotales">$0</td>
            <td><span class="btn eliminarItem" data-item="${contador}">X</span></td>`;
        // itemsfacturacion.innerHTML += texto;
        itemsfacturacion.appendChild(fila)
        contador++;
    }
    eventos();
}

function cargarItem(e){
    let producto = productos.find((prod) => prod.codigo == e.target.value);
    // console.log(producto)
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
    // let porcentajeIva = document.querySelector(`#porcentajeIva${item}`);
    // let estado = document.querySelector(`#estado${item}`);
    
    nombre.innerHTML = producto.nombre;
    medida.innerHTML = producto.fraccionamiento;
    if(producto.fraccionamiento === "kilo"){
        precio.value = "$" + producto.preciokilo;
        cantidad.setAttribute("step", "0.001")
    } else {
        precio.value = "$" + producto.preciounidad;
        cantidad.removeAttribute("step")
    }
    // porcentajeIva.value = producto.iva;
    // estado.value = "true";

    if(producto.fraccionamiento !== "manual"){
        precio.classList.add("inputBloqueado")
    } else {
        precio.classList.remove("inputBloqueado");
        precio.removeEventListener("keydown", bloquearInput)
    }

    eventos();
    calcularItem(e);    
}

let neto = 0;
let iva10 = 0;
let iva21 = 0;
let total = 0;
let detalles = [];

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
    // console.log(producto)
    if(producto === undefined){
        return;
    }
    let cantidad = document.querySelector(`#cant${item}`);
    // let subtotal = document.querySelector(`#sub${item}`);
    let subtotalVisible = document.querySelector(`#subVer${item}`);

    let calculo;
    if(producto.fraccionamiento === "unidad"){
        calculo = producto.preciounidad * cantidad.value;
    } else if(producto.fraccionamiento === "kilo"){
        calculo = producto.preciokilo * cantidad.value;
    } else if(producto.fraccionamiento === "docena"){
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

    // subtotal.value = calculo;
    subtotalVisible.innerHTML = "$" + calculo;

    let detalle = [item, calculo, producto.iva, producto.codigo, parseFloat(cantidad.value)];

    calcularTotal(detalle)
}

function calcularTotal(detalle){
    let itemExistente = detalles.findIndex((item) => item[0] === detalle[0]);
    if(itemExistente < 0){
        detalles.push(detalle);
    } else {
        detalles.splice(itemExistente, 1);
        detalles.push(detalle);
    }
    // console.log(detalles)

    let iva10Acumulador = 0;
    let iva21Acumulador = 0;
    let totalAcumulador = 0;

    detalles.forEach((item) => {
        totalAcumulador += item[1]
        if(item[2] == 105){
            let valor = 1 + (item[2] / 1000)
            iva10Acumulador += item[1] - (item[1] / valor)
        } else if(item[2] == 210){
            let valor = 1 + (item[2] / 1000)
            iva21Acumulador += item[1] - (item[1] / valor)
        }
    })

    total = Math.round(totalAcumulador*100)/100;
    iva10 = Math.round(iva10Acumulador*100)/100;
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
    document.querySelector("#iva10Hide").value = iva10;
    document.querySelector("#iva21Hide").value = iva21;
    document.querySelector("#totalHide").value = total;
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
    // let porcentajeIva = document.querySelector(`#porcentajeIva${item}`);
    document.querySelector(`#estado${item}`).value = "false";
    
    let itemExistente = detalles.findIndex((dato) => dato[0] === item);
    detalles.splice(item, 1);
    // console.log(itemExistente)
    calcularTotal([item, 0, 0]);
}

function eliminarItem(e){
    let item = e.target.dataset.item;
    let fila = document.querySelector(`#fila${item}`);
    fila.remove();
    let itemExistente = detalles.findIndex((dato) => dato[0] === item);
    // console.log(itemExistente);
    detalles.splice(itemExistente, 1);
    calcularTotal([item, 0, 0]);
}

function bloquearInput(e){
    e.preventDefault()
}

function mostrarError(info){
    let mensaje = `<div class="mensajeErrorForm"><span>${info}</span></div>`;
    document.querySelector("#errores").innerHTML = mensaje;
    document.querySelector(".mensajeErrorForm").addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}

/* cargarFecha();

const actualizarHora = setInterval(() => {cargarFecha();}, 200);

fecha.addEventListener("click", () => {clearInterval(actualizarHora)}) */

itemsCreador(5);

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

    document.querySelector("#neto").innerHTML = "$0";
    document.querySelector("#iva10").innerHTML = "$0";
    document.querySelector("#iva21").innerHTML = "$0";
    document.querySelector("#total").innerHTML = "$0";

    neto = 0;
    iva10 = 0;
    iva21 = 0;
    total = 0;
    detalles = [];
}

// Botones

document.querySelector("#cuit").addEventListener("keydown", (e) => {checkCuitInput(e)})
document.querySelector("#cuit").addEventListener("focusout", (e) => {checkCuitNumero(e)})
document.querySelector("#resetFacturacion").addEventListener("click", vaciarFormualrio)


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