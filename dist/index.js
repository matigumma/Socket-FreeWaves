"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = _interopRequireDefault(require("express"));
var _socket = require("socket.io");
var _http = _interopRequireDefault(require("http"));
var _zod = require("zod");
var _config = require("./config.js");
var _path = require("path");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var app = (0, _express["default"])();
var httpServer = _http["default"].createServer(app);
var io = new _socket.Server(httpServer);
app.use(_express["default"]["static"](__dirname + "/public"));
app.use(_express["default"].json());
var STORE = [];
var objectSchema = _zod.z.object({
  // Verificacion Inputs
  name: _zod.z.string().min(1, "Name es requerido"),
  image: _zod.z.string().min(1, "image es requerida"),
  message: _zod.z.string().min(1, "message es requerido"),
  type: _zod.z.string().min(1, "type es requerido")
});
var procesadoApi = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(evento) {
    var schemaResult, obj, evento_en_store, primer_evento_del_tipo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            schemaResult = objectSchema.parse(evento); // console.log(schemaResult)
            obj = evento; // console.log(obj)
            evento_en_store = STORE.filter(function (ev) {
              return ev.type == obj.type;
            })[0]; // console.log(evento_en_store)
            if (evento_en_store) {
              _context.next = 10;
              break;
            }
            primer_evento_del_tipo = {
              name: obj.name,
              image: obj.image,
              message: obj.message,
              type: obj.type,
              count: 1,
              timestamp: new Date() // creando el timestamp en el primer evento del tipo
            };

            STORE.push(primer_evento_del_tipo);
            return _context.abrupt("return", STORE);
          case 10:
            evento_en_store.count++;
            evento_en_store.timestamp = new Date(); // creando el timestamp en cada evento nuevo
            STORE.filter(function (evento_en_store) {
              return evento_en_store.type !== obj.type;
            });
            // console.log(STORE);
          case 13:
            _context.next = 18;
            break;
          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            console.error(_context.t0);
          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));
  return function procesadoApi(_x) {
    return _ref.apply(this, arguments);
  };
}();
io.on("connection", function (socket) {
  //   console.log("id user : ", socket.id);
  // console.log(STORE);
  socket.broadcast.emit("server:STORE", STORE); // primer evento al cargar la pag

  socket.on("cliente:EVENTO", /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
      var dataEvento;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return procesadoApi(data);
            case 2:
              // logica de la api
              dataEvento = _objectSpread(_objectSpread({}, data), {}, {
                id: socket.id
              }); // Agrego el id para identificar el evento, si no se necesita eliminar esta linea
              // console.log(STORE);
              socket.broadcast.emit("server:EVENTO", {
                dataEvento: dataEvento,
                dataEventoProcesado: STORE
              });
            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
});
httpServer.listen(_config.PORT, function () {
  console.log("server en el puerto", _config.PORT);
});