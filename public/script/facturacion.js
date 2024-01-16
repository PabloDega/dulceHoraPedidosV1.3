let contador = 1;
const itemsfacturacion = document.querySelector("#itemsfacturacion");
const fecha = document.querySelector("#fecha")

function cargarFecha(){
    let f = new Date()
    let g = f.getTimezoneOffset()
    let h = new Date().getHours()
    f.setHours(h - (g / 60));
    f = f.toISOString()
    f = f.split(".")
    fecha.value = f[0];
}

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
        console.log("ping")
    }
}

document.querySelector("#cuit").addEventListener("keydown", (e) => {checkCuitInput(e)})
document.querySelector("#cuit").addEventListener("focusout", (e) => {checkCuitNumero(e)})


function itemsCreador(cantidad){
    if(isNaN(cantidad)){
        cantidad = cantidad.target.dataset.cantidad
    }
    for (let i = 0; i < cantidad; i++) {
        let fila = document.createElement("tr")
        fila.setAttribute("id", `fila${contador}`)
        fila.innerHTML = `<td id="item${contador}">${contador}</td>
            <td><input type="text" name="cod${contador}" id="cod${contador}" class="cod" data-item="${contador}"></td>
            <td id="nom${contador}"></td>
            <td><input type="number" name="cant${contador}" id="cant${contador}" value="0" class="cant" data-item="${contador}" min="0"></td>
            <td id="med${contador}"></td>
            <td><input type="text" name="precio${contador}" id="precio${contador}" data-item="${contador}" value="$0" class="precio"></td>
            <td id="iva${contador}">$0</td>
            <td id="subVer${contador}">$0</td>
            <td><span class="btn eliminarItem" data-item="${contador}">X</span></td>
            <input type="hidden" name="porcentajeIva${contador}" id="porcentajeIva${contador}">
            <input type="hidden" name="sub${contador}" id="sub${contador}">
            <input type="hidden" name="estado${contador}" id="estado${contador}" value="false">`;
        // itemsfacturacion.innerHTML += texto;
        itemsfacturacion.appendChild(fila)
        contador++;
    }
    eventos();
}

function cargarItem(e){
    let producto = productos.find((prod) => prod.codigo == e.target.value);
    if(producto == undefined){
        vaciarItem(e);
        return
    }
    let item = e.target.dataset.item
    let nombre = document.querySelector(`#nom${item}`);
    let medida = document.querySelector(`#med${item}`);
    let precio = document.querySelector(`#precio${item}`);
    let porcentajeIva = document.querySelector(`#porcentajeIva${item}`);
    let estado = document.querySelector(`#estado${item}`);
    
    nombre.innerHTML = producto.nombre;
    medida.innerHTML = producto.fraccionamiento;
    precio.value = "$" + producto.preciounidad;
    porcentajeIva.value = producto.iva;
    estado.value = "true";

    if(producto.fraccionamiento !== "manual"){
        precio.setAttribute("class", "inputBloqueado")
    }

    eventos();
    calcularItem(e);    
}

function calcularItem(e){
    let item = e.target.dataset.item;

    let precio = document.querySelector(`#precio${item}`);
    if(precio.value.split("$").length < 2){
        precio.value = "$" + precio.value;
    }
    if(isNaN(parseInt(precio.value.split("$")[1]))){
        vaciarItem(e)
        return
    }

    let codigo = document.querySelector(`#cod${item}`);
    let producto = productos.find((prod) => prod.codigo == codigo.value);
    let cantidad = document.querySelector(`#cant${item}`);
    let subtotal = document.querySelector(`#sub${item}`);
    let subtotalVisible = document.querySelector(`#subVer${item}`);

    let calculo
    if(producto.fraccionamiento === "unidad"){
        calculo = producto.preciounidad * cantidad.value;
    } else if(producto.fraccionamiento === "kilo"){
        calculo = producto.preciokilo * cantidad.value;
    } else if(producto.fraccionamiento === "docena"){
        calculo = producto.preciounidad * (cantidad.value % 12);
        calculo += producto.preciodocena * (Math.trunc(cantidad.value / 12))
    } else if(producto.fraccionamiento === "manual"){
        calculo = precio.value.split("$")[1] * cantidad.value;
    }

    if(isNaN(calculo)){
        vaciarItem(e);
        return
    }

    calculo = Math.round(calculo*100)/100

    subtotal.value = calculo;
    subtotalVisible.innerHTML = "$" + calculo;
}

function vaciarItem(e){
    let item = e.target.dataset.item
    document.querySelector(`#nom${item}`).innerHTML = "";
    document.querySelector(`#med${item}`).innerHTML = "";
    document.querySelector(`#cant${item}`).value = "0"
    document.querySelector(`#precio${item}`).value = "$0";
    document.querySelector(`#subVer${item}`).innerHTML = "$0"
    // let porcentajeIva = document.querySelector(`#porcentajeIva${item}`);
    document.querySelector(`#estado${item}`).value = "false";
}

function eliminarItem(e){
    console.log(e.target.dataset.item)
    let item = e.target.dataset.item;
    let fila = document.querySelector(`#fila${item}`);
    fila.remove()
}

cargarFecha();

const actualizarHora = setInterval(() => {cargarFecha();}, 20000);

fecha.addEventListener("click", () => {clearInterval(actualizarHora)})

itemsCreador(5);

// Botones
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
        boton.addEventListener("keydown", (e) => {e.preventDefault()})
    })
}
eventos();