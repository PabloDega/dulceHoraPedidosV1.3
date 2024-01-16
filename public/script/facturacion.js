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

function itemsCreador(cantidad){
    if(isNaN(cantidad)){
        cantidad = cantidad.target.dataset.cantidad
    }
    for (let i = 0; i < cantidad; i++) {
        let fila = document.createElement("tr")
        fila.innerHTML = `<td id="item${contador}">${contador}</td>
            <td><input type="text" name="cod${contador}" id="cod${contador}" class="cod" data-item="${contador}"></td>
            <td id="det${contador}"></td>
            <td><input type="number" name="cant${contador}" id="cant${contador}" value="0" class="cant" data-item="${contador}"></td>
            <td id="med${contador}"></td>
            <td><input type="text" name="precio${contador}" id="precio${contador}" data-item="${contador}" value="$0" class="precio"></td>
            <td id="iva${contador}">$0</td>
            <td id="subVer${contador}">$0</td>
            <td><span class="btn">X</span></td>
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
    let detalle = document.querySelector(`#det${item}`);
    let medida = document.querySelector(`#med${item}`);
    let precio = document.querySelector(`#precio${item}`);
    let porcentajeIva = document.querySelector(`#porcentajeIva${item}`);
    let estado = document.querySelector(`#estado${item}`);
    
    detalle.innerHTML = producto.descripcion;
    medida.innerHTML = producto.fraccionamiento;
    precio.value = "$" + producto.preciounidad;
    porcentajeIva.value = producto.iva;
    estado.value = "true";
}

function calcularItem(e){
    let item = e.target.dataset.item;
    let precio = document.querySelector(`#precio${item}`);
    if(precio.value.split("$").length < 2){
        precio.value = "$" + precio.value;
    }
    if(precio.value === "$0"){
        return
    }
    let cantidad = document.querySelector(`#cant${item}`)
    let porcentajeIva = document.querySelector(`#porcentajeIva${item}`).value / 10;
    let iva = document.querySelector(`#iva${item}`);
    let subtotal = document.querySelector(`#sub${item}`);
    let subtotalVisible = document.querySelector(`#subVer${item}`)
    // iva.innerHTML = precio.split("$")
    let calculo = precio.value.split("$")[1] * cantidad.value;
    subtotal.value = calculo;
    subtotalVisible.innerHTML = "$" + calculo;
}

function vaciarItem(e){
    let item = e.target.dataset.item
    document.querySelector(`#det${item}`).innerHTML = "";
    document.querySelector(`#med${item}`).innerHTML = "";
    document.querySelector(`#precio${item}`).value = "$0";
    document.querySelector(`#subVer${item}`).innerHTML = "$0"
    // let porcentajeIva = document.querySelector(`#porcentajeIva${item}`);
    document.querySelector(`#estado${item}`).value = "false";
}

cargarFecha();

setInterval(() => {
    cargarFecha();
}, 30000);

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
}
eventos();