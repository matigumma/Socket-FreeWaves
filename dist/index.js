"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _express = _interopRequireDefault(require("express"));
var _socket = require("socket.io");
var _http = _interopRequireDefault(require("http"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var app = (0, _express["default"])();
var httpServer = _http["default"].createServer(app);
var io = new _socket.Server(httpServer);
app.use(_express["default"]["static"](__dirname + "/public"));
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
  //   socket.on("cliente:STORE_ACT", (STORE) => {
  // console.log(STORE);
  // const dataStore = STORE;
  // socket.broadcast.emit("server:STORE_ACT", dataStore);
  //   });
});

httpServer.listen(3000, function () {
  console.log("server en el puerto", 3000);
});