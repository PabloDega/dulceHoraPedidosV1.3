// Funciones selectLocales
if (document.querySelectorAll(".selectLocalLocales") != null) {
  document.querySelectorAll(".selectLocalLocales").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      // verifica si el boton ya esta seleccionado leyendo la segunda clase del e
      if (!e.currentTarget.classList[1]) {
        let nombre = e.currentTarget.innerText;
        let direccion = document.querySelector(`#${e.target.id} span`).innerText;
        nombrarBoton(nombre, direccion);
        seleccionarLocal(e.currentTarget.dataset.id, boton);
        mostrarMapa();
      }
    })
  }
  );
}

function seleccionarLocal(id, boton) {
  document
    .querySelectorAll(".selectLocalLocales")
    .forEach((boton) => {
      boton.classList.remove("selectLocalLocalesActivo");
      // boton.style.order = "1";
    });
  boton.classList.add("selectLocalLocalesActivo");
  // boton.style.order = "0";
  document.querySelectorAll(".localDireccion").forEach((direccion) => {
    direccion.style.display = "none";
  });
  document.querySelector("#span" + id).style.display = "block";
  const local = locales.find((local) => local.id == id);
  document.querySelector("#mapaLocal").src = local.gmap;
  document.querySelectorAll(".localCheck").forEach((check) => {
    check.checked = false;
  });
  document.querySelector("#check" + id).checked = true;
}

function mostrarMapa() {
  document.querySelector(".selectLocalMap").style.display = "flex";
}

function mostrarMapas() {
  document.querySelectorAll(".selectLocalLocales").forEach((boton) => {
    boton.style.display = "block"
  });
  document.querySelector("#selectLocalVerMas").style.display = "none";
}

//ordenar locales por geoposicion
let geoLocales = [];

locales.forEach((local) => {
  const longStart = local.gmap.indexOf("!2d") + 3;
  const longEnd = longStart + 17;
  const geoLong = local.gmap.substring(longStart, longEnd);
  const latStart = local.gmap.indexOf("!3d") + 3;
  const latEnd = latStart + 17;
  const geoLat = local.gmap.substring(latStart, latEnd);
  geoLocales.push({ id: local.id, gmap: local.gmap, geoLat, geoLong });
});

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(calcularCercania);
} else {
  sinGeolocation()
}

function calcularCercania(datos) {
  let diferencias = [];
  const geoClienteLat = datos.coords.latitude;
  const geoClienteLong = datos.coords.longitude;
  geoLocales.forEach((local) => {
    const difLat = geoClienteLat - local.geoLat;
    const difLong = geoClienteLong - local.geoLong;
    diferencias.push({ id: local.id, dif: Math.abs(difLat) + Math.abs(difLong) });
  });
  const diferenciasOrdenadas = diferencias.sort((a, b) =>
    a.dif > b.dif ? 1 : a.dif < b.dif ? -1 : 0
  );
  diferenciasOrdenadas.forEach((orden, i) => {
    let local = document.querySelector(`#local${orden.id}`);
    let localNombre = local.innerText
    let direccion = document.querySelector(`#local${orden.id} span`).innerText;
    local.style.order = i + 1;
    if (i == 0) {
      seleccionarLocal(orden.id, local);
      nombrarBoton(localNombre, direccion);
      mostrarMapa();
    }
    if (i > 5) {
      local.style.display = "none";
    }
    document.querySelector("#selectLocalVerMas").style.display = "block";
    document.querySelector("#selectLocalVerMas").addEventListener("click", () => {
      mostrarMapas()
    })
  });
}

// enviar submit desde el div
document
  .querySelector("#selectLocalFormSubmit")
  .addEventListener("click", () => document.querySelector("#selectLocalForm").submit());

//Nombre de local en boton ingresar
function nombrarBoton(nombre, direccion) {
  document.querySelector("#selectLocalFormSubmit").style.display = "flex";
  document.querySelector("#localSelectRefBoton").innerHTML = "<span id='localSelectNombre'>Local " + nombre + "</span><span id='localSelectDireccion'>" + direccion + "</span>";
}

// Ajustar elementos si no hoy Geo posicionamiento
function sinGeolocation(){}