const socket = io("/");

socket.emit("abrirPedido", {pedidoNumero, localId });

socket.emit("notificacion", { pedidoNumero, localId })

socket.on("chatMensaje", (datos) => {
  chatAgregarMensaje(datos);
  scrollTo(0, chatMensajes.offsetHeight);
  let ventanaChat = document.querySelector(".chatMensajes")
  ventanaChat.scrollTo(0, ventanaChat.scrollHeight)
  window.scrollTo(0, document.body.scrollHeight)
});

socket.on("inputError", (() => {
  let errorBox = document.querySelector(".inputError");
  errorBox.style.display = "flex";
  errorBox.style.animationName = "inputError";
  setTimeout(()=> {
    errorBox.style.animationName = "none",
    errorBox.style.display = "none"
  }, 6000);
}))

socket.on("localOnline", (local) => {
  if (local.local === localId) {
    if (document.querySelector(".chatEstado") != null) {
      let chatEstado = document.querySelector(".chatEstado span span");
      let chatEstilo = document.querySelector(".chatEstado");
      chatEstado.textContent = `conectado`;
      chatEstilo.classList.add("chatEstadoOnline");
    }
  }
});

socket.on("localOffline", (local) => {
  if (local.local === localId) {
    if (document.querySelector(".chatEstado") != null) {
      let chatEstado = document.querySelector(".chatEstado span span");
      let chatEstilo = document.querySelector(".chatEstado");
      chatEstado.textContent = `desconectado`;
      chatEstilo.classList.remove("chatEstadoOnline");
    }
  }
});

socket.on("reload", () => {
  window.location.reload();
});

/* socket.on("pedidoFinaliza", (datos) => {
  chatMensajes.innerHTML += `<div class="chatMensaje chatFinalizado" id="msjL">
        <span class="chatMensajeFecha">${new Date().toLocaleString()}</span>
        <span>
          <b>${datos.nombre}:</b> El local cambió el estado del pedido a ${datos.estado}
          <div class="pedidoBtn" id="cerrarPedidoChat">Cerrar pedido</div>
        </span>
    </div>`;
  document.querySelector("#cerrarPedidoChat").addEventListener("click", () => {console.log("ping")})
});
 */
