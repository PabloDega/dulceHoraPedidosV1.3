if (Notification.permission !== 'denied') {
  Notification.requestPermission();
}

let audioPedido = new Audio("/audio/pedido.mp3");
let audioDing = new Audio("/audio/ding.mp3");

const socket = io("/");

socket.emit("abrirLocal", { local })

socket.on("notificarNewChat", (data) => {
  if(data.localId == local.id){
    let notificacion = new Notification("Nuevo Pedido", { 
      body: `Pedido ${data.pedidoNumero} ingresó en plataforma`,
      lang: "ES",
    });
    notificacion.onclick = (e) => {
      e.preventDefault();
      window.location.href = `/panel/pedidos?id=${data.pedidoNumero}`;
    };
    // let audio = new Audio("/audio/pedido.mp3");
    audioPedido.play();
    setTimeout(() => location.reload(), 2000);
  }
})

socket.on("notificarMensaje", (data) => {
  if(data.localId == local.id){
    document.querySelector(`[data-id="${data.pedidoNumero}"] .pedidosCardMsj`).style.display = "block";
    let notificacion = new Notification("Nuevo Mensaje", { 
      body: `Mensaje de pedido ${data.pedidoNumero}`,
    })
    notificacion.onclick = (e) => {
      e.preventDefault();
      window.location.href = `/panel/pedidos?id=${data.pedidoNumero}`;
    };
    // let audio = new Audio("/audio/ding.mp3");
    audioDing.play();
  }
})

socket.on("inputError", (() => {
  let errorBox = document.querySelector(".inputError");
  errorBox.style.display = "flex";
  errorBox.style.animationName = "inputError";
  setTimeout(()=> {
    errorBox.style.animationName = "none",
    errorBox.style.display = "none"
  }, 6000);
}))

const pedidoFinalizado = (pedido, estado) => {
  let mensaje = `El local cambió el estado del pedido a ${estado}`;
  mensaje = JSON.stringify(mensaje);
  // socket.emit("pedidoFinaliza", { pedido, estado, nombre: chatNombre.value, mensaje})
  socket.emit("envioMensaje", {
    mensaje,
    emisor: chatEmisor.value,
    nombre: chatNombre.value,
    pedidoNumero: pedido,
    localId: window.localId || window.local.id,
    ring: false,
    usuario: window.usuario,
    finalizar: true,
  });
}


const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("id") != null) {
  const pedidoNumero = urlParams.get("id");

  socket.emit("abrirPedido", { pedidoNumero });

  socket.on("chatMensaje", (datos) => {
    chatAgregarMensaje(datos);
    scrollTo(0, chatMensajes.offsetHeight);
  });
}

document.querySelectorAll(".pedidosCardMsj")
.forEach((sobre) => {
  sobre.style.animationDelay = Math.random() + "s";
})

document.querySelector("#verPedidosEntregados").addEventListener("click", (e) => {
  document.querySelectorAll(".pedidoCardEntregado").forEach((card) => {
    card.style.display = "flex";
    e.target.style.display = "none";
  })
})

document.querySelector("#verPedidosCancelados").addEventListener("click", (e) => {
  document.querySelectorAll(".pedidoCardCancelado").forEach((card) => {
    card.style.display = "flex";
    e.target.style.display = "none";
  })
})
// funcionalidad botones de respuesta rapida
if(document.querySelector(".respuestasRapidas") != null){
  let input = document.querySelector("#chatInput");
  document.querySelector("#RRlisto").addEventListener("click", () => {
    input.value = "Pedido listo para retirar";
  })
  document.querySelector("#RRprep15").addEventListener("click", () => {
    input.value = "Su pedido está en preparación, estará listo en 15 minutos aproximadamente";
  })
  document.querySelector("#RRprep30").addEventListener("click", () => {
    input.value = "Su pedido está en preparación, estará listo en 30 minutos aproximadamente";
  })
  document.querySelector("#RRsinStock").addEventListener("click", () => {
    let faltante = window.prompt("Prodcuto sin stock")
    input.value = `Lamentablemente nos quedamos sin stock de ${faltante}, podemos ofrecerle otro prodcuto en reemplazo?`;
  })
}