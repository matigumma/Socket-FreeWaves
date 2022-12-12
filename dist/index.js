"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _express = _interopRequireDefault(require("express"));
var _socket = require("socket.io");
var _http = _interopRequireDefault(require("http"));
var _zod = require("zod");
var _config = require("./config.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// config de produccion

var app = (0, _express["default"])();
var httpServer = _http["default"].createServer(app);
var io = new _socket.Server(httpServer);
app.use(_express["default"]["static"](__dirname + "/public"));
app.use(_express["default"].json());
var objectSchema = _zod.z.object({
  // Verificacion Inputs
  name: _zod.z.string().min(1, "Name es requerido"),
  image: _zod.z.string().min(1, "image es requerida"),
  message: _zod.z.string().min(1, "message es requerido"),
  type: _zod.z.string().min(1, "type es requerido")
});
var STORE = [];
app.post("/date-time", function (req, res) {
  // console.log(req.body);
  try {
    var schemaResult = objectSchema.parse(req.body);
    // console.log(schemaResult);
    var obj = req.body;
    // console.log(obj)
    var evento_en_store = STORE.filter(function (ev) {
      return ev.type == obj.type;
    })[0];
    if (!evento_en_store) {
      var primer_evento_del_tipo = {
        name: obj.name,
        image: obj.image,
        message: obj.message,
        type: obj.type,
        count: 1,
        timestamp: new Date() // creando el timestamp en el primer evento del tipo
      };

      STORE.push(primer_evento_del_tipo);
    } else {
      evento_en_store.count++;
      evento_en_store.timestamp = new Date(); // creando el timestamp en cada evento nuevo
      var NEW_STORE = STORE.filter(function (evento_en_store) {
        return evento_en_store.type !== obj.type;
      });
    }
    // console.log(NEW_STORE);
    res.status(200).send(STORE);
  } catch (e) {
    if (e instanceof _zod.ZodError) {
      return res.status(400).json({
        "Tipo requerido": e.issues[0].type,
        // errores input
        message: e.issues[0].message,
        "El error es en": e.issues[0].path[0]
      });
    } else {
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }
});
var DATA_WS = [];
io.on("connection", function (socket) {
  //   console.log("id user : ", socket.id);
  socket.on("cliente:EVENTO", function (data) {
    // console.log("EVENTO: ", data);
    var dataEvento = _objectSpread(_objectSpread({}, data), {}, {
      id: socket.id
    }); // Agrego el id para identificar el evento, si no se necesita eliminar esta linea
    // console.log(dataEvento);
    DATA_WS.push(dataEvento);
    socket.broadcast.emit("server:EVENTO", dataEvento);
  });
  socket.broadcast.emit("hello", STORE);
});
httpServer.listen(_config.PORT, function () {
  console.log("server en el puerto", _config.PORT);
});