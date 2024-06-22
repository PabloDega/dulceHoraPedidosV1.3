if (document.querySelector("#verUsuarioLocal") != null) {
    document.querySelector("#verUsuarioLocal").addEventListener("click", () => {location.href = "/panel/usuarios/local"});
}
if (document.querySelector("#verUsuario") != null) {
    document.querySelector("#verUsuario").addEventListener("click", () => {location.href = "/panel/usuarios"});
}
if (document.querySelector("#nuevoUsuarioLocal") != null) {
    document.querySelector("#nuevoUsuarioLocal").addEventListener("click", () => {location.href = "/panel/usuarios/local/nuevo"});
}
if (document.querySelector("#nuevoUsuario") != null) {
    document.querySelector("#nuevoUsuario").addEventListener("click", () => {location.href = "/panel/usuarios/nuevo"});
}