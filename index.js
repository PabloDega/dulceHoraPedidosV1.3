global.__basedir = __dirname;

require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
const server = require("http").createServer(app);

//-----------------------------
// Layouts EJS
app.set("view engine", "ejs");
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", __basedir + "/src/views/layouts/panel");

//-----------------------------
// cookies
const session = require("cookie-session");
app.use(
  session({
    name: "session",
    keys: [process.env.SESSION_KEYS1, process.env.SESSION_KEYS2],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//-----------------------------
// Routes
const mainRoutes = require("./src/routes/mainRoutes");
app.use("/", mainRoutes);

const panelRoutes = require("./src/routes/panelRoutes");
const { isNotLogged } = require("./src/middlewares/auth");
app.use("/panel", isNotLogged, panelRoutes);

const authRoutes = require("./src/routes/authRoutes");
app.use("/login", authRoutes);
app.use("/admin", authRoutes);

app.use(express.static("public"));

app.use((req, res, next) => {
  res.status(404).redirect("/404.html");
});

//-----------------------------
// CHAT SERVER

// const actividad = require(__basedir + "/src/middlewares/actividad");
const chatUsuarios = require("./src/services/chat");
const validar = require("./src/middlewares/validador");
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  // Abrir sala de pedido
  socket.on("abrirPedido", (datos) => {
    let pedidoNumero = "sala" + datos.pedidoNumero;
    chatUsuarios.insertUsuario(socket.id, pedidoNumero);
    socket.join(pedidoNumero);

    // mensaje de usuario conectado
    socket.broadcast.to(pedidoNumero).emit("chatEstado", {
      estadoConexion: true,
    });
  });

  // Emitir sonido en local
  socket.on("notificacion", (datos) => {
    io.emit("notificarNewChat", datos);
  });

  // Envio de mensaje
  socket.on("envioMensaje", async (data) => {
    const usuario = await chatUsuarios.getUsuario(socket.id);
    let sala = usuario.sala.slice(4, usuario.sala.length);
    if(!validar.dataValidator(data)){
      io.to(socket.id).emit("inputError");
      return;
    }
    // limita la cantidad de mensajes, a los 10 hace reload y gasta un rate limit
    if(chatUsuarios.limitarMensajesChat(socket.id)){
      socket.emit("reload")
      return
    }
    data.fecha = Date.now();
    // nueva instancia del objeto para ser recibido y modificado por el servicio
    let datos = {};
    for(let x in data){
      datos[x] = data[x];
    }
    await chatUsuarios.insertMensaje(datos, sala);
    // await actividad.actividadCliente(Number(data.localId), data.pedidoNumero, data.usuario || data.nombre, "Mensaje", data.mensaje)
    io.to(usuario.sala).emit("chatMensaje", {
      mensaje: data.mensaje,
      emisor: data.emisor,
      nombre: data.nombre,
      fecha: data.fecha,
      finalizar: datos.finalizar,
    });
    if(data.ring){
      io.emit("notificarMensaje", {
        pedidoNumero: data.pedidoNumero,
        localId: data.localId,
      });
    }
  });

  // mensaje de usuario desconectado
  socket.on("disconnect", async() => {
    // cierra local, lo quita del array
    let usersOnlineLocal = chatUsuarios.chatLocalActivoSub(socket.id)
    try {
      if(usersOnlineLocal.usuarios.length < 1){
        io.emit("localOffline", { local: usersOnlineLocal.local })
      }
    } catch (error) {
      
    }
    
  });

  // abre local, agregar local al array
  socket.on("abrirLocal", async ({ local }) => {
    await chatUsuarios.chatLocalActivoAdd(local.id, socket.id);
    io.emit("localOnline", { local: local.id });
  })

});

//-----------------------------
// Server
const PORT = process.env.SERVERPORT;

server.listen(PORT, () => {
  console.log("Servidor activo en http://localhost:" + PORT);
});

module.exports = { io };
