const socket = io();

const Name = document.querySelector("#name");
const Image = document.querySelector("#image");
const Type = document.querySelector("#type");
const Message = document.querySelector("#message");
const btn_enviar_evento = document.querySelector("#enviar_evento");
const btn_br_evento = document.querySelector("#br_evento");
const enviado = document.querySelector("#enviado");

// primera conexion, recibe el broadcast del STORE y emite un evento de conexion
socket.on("connect", () => {
  console.log("conected");
  
  socket.on("server:STORE", (data) => {
    console.log("Store actual:", data); // cuando se carga el cliente te muestra el store por consola
  });

  socket.emit("cliente:EVENTO", {
    // emito el primer evento al STORE
    name: Name.value, //string
    image: Image.value, //string
    message: Message.value, //string
    type: Type.value,
  });

  socket.on("server:EVENTO", (data) => {
    const { dataEvento, dataEventoProcesado } = data;
    brEvent(dataEvento); // funcion en ui.js... Para mostrar los datos del brodcast evento sin procesar
    brEventProceced(dataEventoProcesado);// funcion en ui.js... Para mostrar los datos del brodcast evento procesado
  }); 
});
btn_enviar_evento.addEventListener("click", (e) => { // se emite un evento con el boton enviar al ws
  e.preventDefault();
  console.log("enviando WS");
  enviado.innerHTML = `<h1>ENVIADO WS ✈</h1>`;
  socket.emit("cliente:EVENTO", {
    name: Name.value, //string
    image: Image.value, //string
    message: Message.value, //string
    type: Type.value,
  });
});
