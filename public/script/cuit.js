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
        return false;
    }
    if(caracteres !== 11){
        mostrarError(`Número de CUIT ${e.target.value} inválido`);
        document.querySelector("#cuit").value = "";
        // hacer foco en elemento cuit document.querySelector("#cuit")
        return false;
    }
    if(document.querySelector("#registrarFacturacionA") != null){
        const boton = document.querySelector("#registrarFacturacionA")
        boton.classList.remove("btnGris");
        boton.classList.add("btnAzul");
        return true;
    }
    return false;
}

document.querySelector("#cuit").addEventListener("keydown", (e) => {checkCuitInput(e)});
document.querySelector("#cuit").addEventListener("focusout", async (e) => {
    let check = checkCuitNumero(e);
    if(check){
        await consultarPadron(e);
    }
});


function mostrarError(info){
    let mensaje = `<div class="mensajeErrorForm"><span>${info}</span><span id="timeBar"></span></div>`;
    document.querySelector("#errores").innerHTML = mensaje;
    document.querySelector(".mensajeErrorForm").addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}