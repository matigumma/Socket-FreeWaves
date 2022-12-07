import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);

app.use(express.static(__dirname + "/public"));
var DATA_WS = [];
io.on("connection", (socket) => {
//   console.log("id user : ", socket.id);
  socket.on("cliente:EVENTO", (data) => {
    // console.log("EVENTO: ", data);
    const dataEvento = { ...data, id: socket.id }; // Agrego el id para identificar el evento, si no se necesita eliminar esta linea
    // console.log(dataEvento);
    DATA_WS.push(dataEvento);
    socket.broadcast.emit("server:EVENTO", dataEvento);
  });
  //   socket.on("cliente:STORE_ACT", (STORE) => {
  // console.log(STORE);
  // const dataStore = STORE;
  // socket.broadcast.emit("server:STORE_ACT", dataStore);
  //   });
});

httpServer.listen(3000, () => {
  console.log("server en el puerto", 3000);
});
