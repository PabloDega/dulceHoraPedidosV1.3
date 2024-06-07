if (window.registros.length === 0) {
  const texto =
    "No hay registros previos de apertura/cierre de cajas, para iniciar la interfaz debe abrir la caja por primera vez";
  abrirCajaAuto(texto);
}

function abrirCajaAuto(texto) {
  let popScreen = document.querySelector("#popScreen");
  popScreen.innerHTML += `<div id="cortina">
    <div id="confirmarAbrirCajaAuto">
      ${texto}
      <div class="btn btnNaranja" id="btnAbrirCajaAuto">Confirmar</div>
      <div class="btn btnRojo" id="btnAbrirCajaAutoCancelar">Cancelar</div>
    </div>
  </div>`;
  document.querySelector("#btnAbrirCajaAuto").addEventListener("click", () => {
    window.location.href = "/panel/local/caja/cierre/abrir";
  });
  document.querySelector("#btnAbrirCajaAutoCancelar").addEventListener("click", cerrarPopEliminar);
}

document.querySelector("#abrirCaja").addEventListener("click", () => {
    window.location.href = "/panel/local/caja/cierre/abrir";
})

if(document.querySelector(".cierreCajaCerrar") !== null){
    document.querySelectorAll(".cierreCajaCerrar").forEach((boton) => {
        boton.addEventListener("click", (e) => {
            window.location.href = `/panel/local/caja/cierre/cerrar?id=${e.target.dataset.id}`;
        })
    })
}

if(document.querySelector("#verMasSenias") !== null){
  document.querySelector("#verMasSenias").addEventListener("click", () => {
      let params = new URLSearchParams(document.location.search);
      let resultados = params.get("resultados")
      if(resultados === null){
          resultados = 7
      }
      resultados = parseInt(resultados) + 7;
      window.location.href = `/panel/local/caja/cierre?resultados=${resultados}`
  })
}

if(contador == 0){
  dias = dias + 7;
  window.location.href = `/panel/local/caja/cierre?resultados=${dias}`;
}