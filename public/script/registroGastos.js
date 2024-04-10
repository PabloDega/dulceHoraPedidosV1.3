document.querySelector("#fechaRegGastos").addEventListener("change", (e) => {
    let fecha = e.target.value;
    fecha = fecha.replace(/-/g, "");
    window.location.href = `/panel/facturacion/registros/gastos?fecha=${fecha}`;
  });