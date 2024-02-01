const { conectar } = require(__basedir + "/src/config/dbConnection");
const io = require(__basedir + "/index");
const limiter = require("../middlewares/limiter");

const getMensajes = async(id) => {
  try {
    const rows  = await conectar.query('SELECT * FROM pedidos WHERE ?', { id });
    return rows[0][0].mensajes;
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

const insertMensaje = async(data, id) => {
  try {
    // recupera mensajes
    const rows  = await conectar.query('SELECT * FROM pedidos WHERE ?', { id });
    //agrega mensaje entrante
    let datosArray = [];
    // verifica contenido para no agregar campo vacio
    if(rows[0][0].mensajes != ""){
      datosArray.push(rows[0][0].mensajes)
    }
    // agrega mensaje nuevo al array
    delete data.localId;
    let datosString = JSON.stringify(data);
    datosArray.push(datosString);
    // Actualiza info en bbdd
    await conectar.query(`UPDATE pedidos SET mensajes = '${datosArray}', buzon = 'mensaje' WHERE id = '${id}'`);
  } catch (error) {
    throw error;
  } finally {
    conectar.releaseConnection();
  }
};

// Manejo de salas

let chatUsuarios = [];

function insertUsuario(id, sala){
  const usuario = { id, sala }
  chatUsuarios.push(usuario);
  return usuario;
}

function getUsuario(id){
  let res = chatUsuarios.find((usuario) => usuario.id == id)
  return res;
}


// Verifica locales online/offline

let chatLocalesActivos = [];

for(let i = 0; i < 50; i++){
  let dato = {
    local: i + 1,
    usuarios: []
  };
  chatLocalesActivos.push(dato);
}

async function chatLocalActivoAdd(local, socketId){
  let chatFind = chatLocalesActivos.findIndex((dato) => dato.local == local);
  if(chatFind == -1){
    let datos = {
      local: local,
      usuarios: [],
    }
    chatLocalesActivos.push(datos)
  }
  await chatLocalesActivos[chatFind].usuarios.push(socketId);
} 

function chatLocalActivoSub(socket){
  let resultado = 0;
  chatLocalesActivos.forEach((dato) => {
    let busqueda = dato.usuarios.findIndex((dato) => dato == socket);
    if(busqueda != -1){
      dato.usuarios.splice(busqueda, 1);
      resultado = dato;
    }
  })
  return resultado;
}

function chatLocalActivoGet(local){
  let chatFind = chatLocalesActivos.findIndex((dato) => dato.local == local);
  return chatFind.usuarios;
}

// Limitar cantidad de mesnajes por socket.id

let contadorDeMensajes = []

function limitarMensajesChat(socketid){
  let orden = contadorDeMensajes.findIndex((dato) => dato.id == socketid);
  if(orden == -1){
    let dato = {
      id: socketid,
      cantidad: 1,
    }
    contadorDeMensajes.push(dato);
  } else {
    contadorDeMensajes[orden].cantidad += 1;
    if(contadorDeMensajes[orden].cantidad > 10){
      return true;
    }
  }
  return false;
}

module.exports = {
  getMensajes,
  insertMensaje,
  insertUsuario,
  getUsuario,
  chatLocalActivoAdd,
  chatLocalActivoSub,
  chatLocalActivoGet,
  limitarMensajesChat,
}