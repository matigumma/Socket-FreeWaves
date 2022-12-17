import express from "express";
const cors = require("cors");

import { Server as SocketServer } from "socket.io";
import http from "http";
import { z } from "zod";
import { PORT } from "./config.js"; // config de produccion

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);

// app.use(express.static(__dirname + "/public"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
var STORE = [];

const objectSchema = z.object({
  // Verificacion Inputs
  name: z.string().min(1, "Name es requerido").nullish(),
  image: z.string().min(1, "image es requerida").nullish(),
  message: z.string().min(1, "message es requerido").nullish(),
  type: z.string().min(1, "type es requerido").nullish(),
});

const procesadoApi = async (evento) => {
  const obj = evento;
  const evento_en_store = STORE.filter((ev) => ev.name == obj.name)[0];
  if (!evento_en_store) {
    // si no existe un evento previo del mismo tipo se crea
    const primer_evento_del_tipo = {
      name: obj.name,
      image: obj.image,
      message: obj.message,
      type: obj.type,
      count: 1,
      timestamp: new Date().getTime(), // creando el timestamp en el primer evento del tipo
    };
    STORE.push(primer_evento_del_tipo);
  } else {
    // si ya existe un evento del mismo tipo se actualiza
    evento_en_store.count++;
    evento_en_store.timestamp = new Date(); // creando el timestamp en cada evento nuevo
    STORE.some((evento_en_store) => evento_en_store.name !== obj.name); //filtrando los eventos del mismo tipo
  }
};

io.on("connection", (socket) => {
  socket.emit("server:STORE", STORE);

  socket.on("cliente:EVENTO", async (data) => {
    try {
      objectSchema.parse(data);
      socket.emit("server:EVENTO", {
        EVENTO: data,
        STORE: STORE
      });
      await procesadoApi(data);
    } catch (e) {
      console.log(e);
    }
  });
});


app.post("/", async (req, res) => {
  try {
    objectSchema.parse(req.body);
    await procesadoApi(req.body)
    res.status(200).send();
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).json({
        "Tipo requerido": e.issues[0].type, // errores input
        "Error message": e.issues[0].message,
        "El error es en": e.issues[0].path[0],
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

app.get("/", (req, res) => {
  res.status(200).json(STORE);
});

httpServer.listen(PORT, () => {
  console.log("server en el puerto", PORT);
});
