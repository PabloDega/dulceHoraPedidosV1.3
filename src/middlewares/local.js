const servicesLocal = require(__basedir + "/src/services/local");

const crearObjetoServicios = async (lista, data) => {
  let servicios = {};
  lista.forEach((item) => {
    let estado = false;
    if (data[item.servicio] == "true") {
      estado = true;
    }
    servicios[item.servicio] = estado;
  });
  servicios = JSON.stringify(servicios);
  return servicios;
};

const crearObjetoDiasEntrega = async (data) => {
  let diasSemana = [0, 1, 2, 3, 4, 5, 6];
  let diasEntrega = [];
  diasSemana.forEach((dia) => {
    if (data[dia] !== undefined) {
      diasEntrega.push(parseInt(data[dia]));
    }
  });
  return JSON.stringify(diasEntrega);
};

const crearObjetoDiasEntrega2 = async (data) => {
  let dias = [false, false, false, false, false, false, false];
  data = JSON.parse(data);
  data.forEach((item) => {
    dias[item] = true;
  })
  return dias;
}

const filtarServicios = async (local) => {
  let servicios;
  if(local == 0){
    servicios = {}
  } else {
    data = await servicesLocal.getLocal(local);
    if(data === undefined){
      servicios = {};
    } else{
      servicios = JSON.parse(data.servicios);
    }
  }
  return servicios;
}

const localesConFacturacion = async (locales) => {
  let localesConFacturacion = [];
  locales.forEach((local) => {
    if(JSON.parse(local.servicios).facturacion){
      localesConFacturacion.push(local)
    }
  });
  return localesConFacturacion;
}

module.exports = {
  crearObjetoServicios,
  crearObjetoDiasEntrega,
  crearObjetoDiasEntrega2,
  filtarServicios,
  localesConFacturacion,
};
