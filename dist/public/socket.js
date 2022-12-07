"use strict";

var socket = io();
var Name = document.querySelector("#name");
var Image = document.querySelector("#image");
var Type = document.querySelector("#type");
var Message = document.querySelector("#message");
var btn_enviar_evento = document.querySelector("#enviar_evento");
var btn_br_evento = document.querySelector("#br_evento");
var enviado = document.querySelector("#enviado");

// console.log(Name.value);

socket.on("connect", function () {
  console.log("conected");
});
btn_enviar_evento.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("enviando");
  enviado.innerHTML = "<h1>ENVIADO \u2708</h1>";
  //funcion en ui.js
  sendEvent({
    name: Name.value,
    //string
    image: Image.value,
    //string
    message: Message.value,
    //string
    type: Type.value
  });
  socket.emit("cliente:EVENTO", {
    //funcion en ui.js
    name: Name.value,
    //string
    image: Image.value,
    //string
    message: Message.value,
    //string
    type: Type.value
  });
  socket.on("server:EVENTO", appendEvent); //funcion en ui.js
});