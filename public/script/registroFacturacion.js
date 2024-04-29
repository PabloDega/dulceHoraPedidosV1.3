document.querySelector("#fechaRegFact").addEventListener("change", (e) => {
  let fecha = e.target.value;
  fecha = fecha.replace(/-/g, "");
  window.location.href = `/panel/facturacion/registros?fecha=${fecha}`;
});

async function reimprimirTicket(data) {
  let ticket;
  if (data.tipo === "X") {
    ticket = await crearComprobanteComanda(parseInt(data.id));
  } else if (data.tipo == "A" || data.tipo == "B" || data.tipo == "C" || data.tipo == 3 || data.tipo == 8 || data.tipo == 13) {
    ticket = await crearComprobanteCAE(data.id);
  } else if (data.tipo === "S") {
    ticket = await crearComprobanteSenia(data.id);
  }
  if (ticket.error) {
    mostrarError(ticket.error);
    return;
  }
  document.querySelector("#factTickets").innerHTML = ticket;
  if (data.tipo == "A" || data.tipo == "B" || data.tipo == "C" || data.tipo == 3 || data.tipo == 8 || data.tipo == 13) {
    crearQR(QRstring);
  }
  setTimeout(() => {
    window.print();
  }, 500);
}

function mostrarError(info) {
  let mensaje = `<div class="mensajeErrorForm"><span>${info}</span><span id="timeBar"></span></div>`;
  document.querySelector("#errores").innerHTML = mensaje;
  document
    .querySelector(".mensajeErrorForm")
    .addEventListener("click", (e) => (e.currentTarget.style.display = "none"));
}

document.querySelectorAll(".reimprimirTicket").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        data = e.target.dataset;
        
        reimprimirTicket(data);
    })
})

document.querySelectorAll(".btnNC").forEach((boton) => {
  boton.addEventListener("click", (e) => {
    confirmaNC(e.target.dataset);
    // console.log(e.target.dataset)
  })
})

// confirmar NC
function confirmaNC(data) {
  let popScreen = document.querySelector("#popScreen");
  popScreen.innerHTML += `<div id="cortina">
  <div id="confirmarEliminar">
    Está acción registrará una nota de crédito por el total de la factura. Esta acción no se puede deshacer. Desea
    continuar?
    <div class="btn btnNaranja" id="btnEliminar">Confirmar</div>
    <div class="btn btnRojo" id="btnEliminarCancelar">Cancelar</div>
  </div>
</div>`;
  document.querySelector("#btnEliminar").addEventListener("click", async (e) => {
        document.querySelector("#cortinaLoad").style.display = "flex";
        let respuesta = await fetch(`/panel/facturacion/nc?id=${data.id}&tipo=${data.tipo}`, { method: "GET" });
        respuesta = await respuesta.json()
        if(respuesta.error){
          cerrarPopEliminar();
          document.querySelector("#cortinaLoad").style.display = "none";
          mostrarError(respuesta.error);
          return
        }
        if(respuesta.resultado){
          location.reload()
        }
      }
    );
  document.querySelector("#btnEliminarCancelar").addEventListener("click", cerrarPopEliminar);
}

function cerrarPopEliminar() {
  let popScreen = document.querySelector("#popScreen");
  popScreen.innerHTML = "";
}