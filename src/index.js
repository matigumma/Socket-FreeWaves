import express from "express";
import { Server as SocketServer } from "socket.io";
import http from "http";
import { z, ZodError } from "zod";
import { PORT } from "./config.js"; // config de produccion

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);

app.use(express.static(__dirname + "/public"));
app.use(express.json());

const objectSchema = z.object({
  // Verificacion Inputs
  name: z.string().min(1, "Name es requerido"),
  image: z.string().min(1, "image es requerida"),
  message: z.string().min(1, "message es requerido"),
  type: z.string().min(1, "type es requerido"),
});
var STORE = [];
app.post("/date-time", (req, res) => {
  // console.log(req.body);
  try {
    const schemaResult = objectSchema.parse(req.body);
    // console.log(schemaResult);
    const obj = req.body;
    // console.log(obj)
    const evento_en_store = STORE.filter((ev) => ev.type == obj.type)[0];

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
    } else {
      evento_en_store.count++;
      evento_en_store.timestamp = new Date(); // creando el timestamp en cada evento nuevo
      var NEW_STORE = STORE.filter(
        (evento_en_store) => evento_en_store.type !== obj.type
      );
    }
    // console.log(NEW_STORE);
    res.status(200).send(STORE);
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).json({
        "Tipo requerido": e.issues[0].type, // errores input
        message: e.issues[0].message,
        "El error es en": e.issues[0].path[0],
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

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
  socket.broadcast.emit("hello", STORE);
});

httpServer.listen(PORT, () => {
  console.log("server en el puerto", PORT);
});
