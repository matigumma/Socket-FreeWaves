"use strict";

var ventana_br = document.querySelector("#ventana_br");
var ventana_send = document.querySelector("#ventana_send");
var appendEvent = function appendEvent(e) {
  console.log(e);
  var name = e.name,
    image = e.image,
    message = e.message,
    type = e.type,
    id = e.id;
  ventana_br.innerHTML = " <ul>\n  <li>Name:".concat(name, "</li>\n  <li>Image: ").concat(image, "</li>\n  <li>Message: ").concat(message, "</li>\n  <li>Type: ").concat(type, "</li>\n  <li>Type: ").concat(id, "</li>\n</ul>");
};
var sendEvent = function sendEvent(e) {
  // console.log(e)
  var name = e.name,
    image = e.image,
    message = e.message,
    type = e.type;
  ventana_send.innerHTML = " <ul>\n    <li>Name:".concat(name, "</li>\n    <li>Image: ").concat(image, "</li>\n    <li>Message: ").concat(message, "</li>\n    <li>Type: ").concat(type, "</li>\n  </ul>");
};