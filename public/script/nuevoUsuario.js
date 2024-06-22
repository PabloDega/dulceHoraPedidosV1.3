document.querySelector("#ubicacionUser").addEventListener("change", (e) => {
    habilitarSelectRol(e.target.value);
})

function habilitarSelectRol(ubicacion){
    document.querySelector("#rolUser").removeAttribute("disabled");
    document.querySelector("#rolUser").innerHTML = ""
    if(ubicacion == "local"){
        document.querySelector("#rolUser").innerHTML = `
            <option value="" selected disabled>-Seleccione un Rol-</option>
            <option value="admin">Administración</option>
            <option value="atencion">Atención</option>`;
            document.querySelector("#localUserSelect").style.display = "flex";
    } else if(ubicacion == "fabrica"){
        document.querySelector("#rolUser").innerHTML = `
            <option value="" selected disabled>-Seleccione un Rol-</option>
            <option value="produccion">Producción</option>
            <option value="supervisor">Supervisión</option>`;
            document.querySelector("#localUserSelect").style.display = "none";
            document.querySelector("#localUser").value = "0";
    }
}