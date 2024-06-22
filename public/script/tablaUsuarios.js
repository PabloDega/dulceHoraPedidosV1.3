if (document.querySelector("#backListaUsuarioEditar") != null) {
    document.querySelectorAll("#backListaUsuarioEditar").forEach((boton) =>
        boton.addEventListener("click", (e) => (location.href = "/panel/usuarios/editar?id=" + e.target.dataset.id))
      );
}
if (document.querySelector("#backListaUsuarioEliminar") != null) {
    document.querySelectorAll("#backListaUsuarioEliminar").forEach((boton) => 
        {boton.addEventListener("click", (e) => confirmaEliminar(e.target.dataset))}
    );
}
if (document.querySelector("#backListaUsuarioEditarLocal") != null) {
    document.querySelectorAll("#backListaUsuarioEditarLocal").forEach((boton) =>
        boton.addEventListener("click", (e) => (location.href = "/panel/usuarios/local/editar?id=" + e.target.dataset.id))
    );
}
if (document.querySelector("#backListaUsuarioEliminarLocal") != null) {
    document.querySelectorAll("#backListaUsuarioEliminarLocal").forEach((boton) =>
        {boton.addEventListener("click", (e) => confirmaEliminar(e.target.dataset))}
    );
}