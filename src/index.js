import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";
import { z } from "zod";
import { PORT } from "./config.js"; // config de produccion
import { resolve } from "path";

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);

app.use(express.static(__dirname + "/public"));
app.use(express.json());
var STORE = [];

const objectSchema = z.object({
  // Verificacion Inputs
  name: z.string().min(1, "Name es requerido"),
  image: z.string().min(1, "image es requerida"),
  message: z.string().min(1, "message es requerido"),
  type: z.string().min(1, "type es requerido"),
});

const procesadoApi = async (evento) => {
  try {
    const schemaResult = objectSchema.parse(evento);
    // console.log(schemaResult)
    const obj = evento;
    // console.log(obj)
    const evento_en_store = STORE.filter((ev) => ev.type == obj.type)[0];
    // console.log(evento_en_store)
    if (!evento_en_store) {
      const primer_evento_del_tipo = {
        name: obj.name,
        image: obj.image,
        message: obj.message,
        type: obj.type,
        count: 1,
        timestamp: new Date(), // creando el timestamp en el primer evento del tipo
      };
      STORE.push(primer_evento_del_tipo);
      return STORE;
    } else {
      evento_en_store.count++;
      evento_en_store.timestamp = new Date(); // creando el timestamp en cada evento nuevo
      STORE.filter((evento_en_store) => evento_en_store.type !== obj.type);
      // console.log(STORE);
    }
  } catch (error) {
    console.error(error);
  }
};

io.on("connection", (socket) => {
  //   console.log("id user : ", socket.id);
  // console.log(STORE);
  socket.broadcast.emit("server:STORE", STORE); // primer evento al cargar la pag

  socket.on("cliente:EVENTO", async (data)=> {
   await procesadoApi(data); // logica de la api
    const dataEvento = { ...data, id: socket.id }; // Agrego el id para identificar el evento, si no se necesita eliminar esta linea
    // console.log(STORE);
    socket.broadcast.emit("server:EVENTO", {
      dataEvento: dataEvento,
      dataEventoProcesado: STORE,
    });
  });
});

httpServer.listen(PORT, () => {
  console.log("server en el puerto", PORT);
});
