const socket = io();

const Name = document.querySelector("#name");
const Image = document.querySelector("#image");
const Type = document.querySelector("#type");
const Message = document.querySelector("#message");
const btn_enviar_evento = document.querySelector("#enviar_evento");
const btn_br_evento = document.querySelector("#br_evento");
const enviado = document.querySelector("#enviado");

// console.log(Name.value);

socket.on("connect", () => {
  console.log("conected");
});

btn_enviar_evento.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("enviando");
  enviado.innerHTML = `<h1>ENVIADO ✈</h1>`;
  //funcion en ui.js
  sendEvent({
    name: Name.value, //string
    image: Image.value, //string
    message: Message.value, //string
    type: Type.value,
  });
  socket.emit("cliente:EVENTO", {
    //funcion en ui.js
    name: Name.value, //string
    image: Image.value, //string
    message: Message.value, //string
    type: Type.value,
  });
  socket.on("server:EVENTO", appendEvent); //funcion en ui.js
});

