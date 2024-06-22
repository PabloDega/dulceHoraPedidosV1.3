document.querySelector("#usuarioForm").addEventListener("submit", (e) => {
    e.preventDefault();
    let check = checkPasswords();
    if(check.error){
        mostrarError(check.msg);
    } else {
        if(check.check){
            e.target.submit();
        }
    }
})

function checkPasswords(){
    let pass1 = document.querySelector("#password");
    let pass2 = document.querySelector("#passwordrep");
    if(pass1.value !== "" || pass2.value !== ""){
        if(pass1.value == pass2.value){
            return {error: false, msg: "", check: true};
        } else {
            return {error: true, msg: "Las contraseñas no coinciden", check: false};
        }
    } else {
        return {error: false, msg: "", check: true}
    }
}

function mostrarError(info){
    let mensaje = `<div class="mensajeErrorForm"><span>${info}</span><span id="timeBar"></span></div>`;
    document.querySelector("#errores").innerHTML = mensaje;
    document.querySelector(".mensajeErrorForm").addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}
document.querySelector("#password").addEventListener("focus", () => {
    document.querySelector("#refPassword").style.display = "block";
})
