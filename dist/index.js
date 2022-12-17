"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _express = _interopRequireDefault(require("express"));
var _socket = require("socket.io");
var _http = _interopRequireDefault(require("http"));
var _zod = require("zod");
var _config = require("./config.js");
var cors = require("cors");
// config de produccion

var app = (0, _express["default"])();
var httpServer = _http["default"].createServer(app);
var io = new _socket.Server(httpServer);
app.use(_express["default"]["static"](__dirname + "/public"));
app.use(cors({
  origin: "*"
}));
app.use(_express["default"].json());
var STORE = [];
var objectSchema = _zod.z.object({
  // Verificacion Inputs
  name: _zod.z.string().min(1, "Name es requerido").nullish(),
  image: _zod.z.string().min(1, "image es requerida").nullish(),
  message: _zod.z.string().min(1, "message es requerido").nullish(),
  type: _zod.z.string().min(1, "type es requerido").nullish()
});
var procesadoApi = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(evento) {
    var obj, evento_en_store, primer_evento_del_tipo;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            obj = evento;
            evento_en_store = STORE.filter(function (ev) {
              return ev.name == obj.name;
            })[0];
            if (!evento_en_store) {
              // si no existe un evento previo del mismo tipo se crea
              primer_evento_del_tipo = {
                name: obj.name,
                image: obj.image,
                message: obj.message,
                type: obj.type,
                count: 1,
                timestamp: new Date().getTime() // creando el timestamp en el primer evento del tipo
              };

              STORE.push(primer_evento_del_tipo);
            } else {
              // si ya existe un evento del mismo tipo se actualiza
              evento_en_store.count++;
              evento_en_store.timestamp = new Date(); // creando el timestamp en cada evento nuevo
              STORE.some(function (evento_en_store) {
                return evento_en_store.name !== obj.name;
              }); //filtrando los eventos del mismo tipo
            }
            // console.log(STORE);
            res.status(200).json(STORE);
          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return function procesadoApi(_x) {
    return _ref.apply(this, arguments);
  };
}();
io.on("connection", function (socket) {
  socket.emit("server:STORE", STORE);
  socket.on("cliente:EVENTO", /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(data) {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              objectSchema.parse(data);
              socket.emit("server:EVENTO", {
                EVENTO: data,
                STORE: STORE
              });
              _context2.next = 5;
              return procesadoApi(data);
            case 5:
              _context2.next = 10;
              break;
            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);
            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 7]]);
    }));
    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
});
app.post("/", /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            objectSchema.parse(req.body);
            _context3.next = 4;
            return procesadoApi(req.body);
          case 4:
            res.status(200).send();
            _context3.next = 14;
            break;
          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            if (!(_context3.t0 instanceof ZodError)) {
              _context3.next = 13;
              break;
            }
            return _context3.abrupt("return", res.status(400).json({
              "Tipo requerido": _context3.t0.issues[0].type,
              // errores input
              "Error message": _context3.t0.issues[0].message,
              "El error es en": _context3.t0.issues[0].path[0]
            }));
          case 13:
            return _context3.abrupt("return", res.status(500).json({
              message: "Internal server error"
            }));
          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}());
app.get("/", function (req, res) {
  res.status(200).json(STORE);
});
httpServer.listen(_config.PORT, function () {
  console.log("server en el puerto", _config.PORT);
});