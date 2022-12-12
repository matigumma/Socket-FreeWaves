const ventana_br = document.querySelector("#ventana_br");
const ventana_send = document.querySelector("#ventana_send");
const ventana_api = document.querySelector("#ventana_api");
const error = document.querySelector("#error");
const ventana_br_ACT = document.querySelector("#ventana_br_ACT");

// Broadcast del evento sin procesar:
const appendEvent = (e) => {
  // console.log(e);
  const { name, image, message, type, id } = e;
  ventana_br.innerHTML = ` <ul>
  <li>Name:${name}</li>
  <li>Image: ${image}</li>
  <li>Message: ${message}</li>
  <li>Type: ${type}</li>
  <li>Id: ${id}</li>
</ul>`;
};

// Evento Enviado
const sendEvent = (e) => {
  // console.log(e)
  const { name, image, message, type } = e;
  ventana_send.innerHTML = ` <ul>
    <li>Name:${name}</li>
    <li>Image: ${image}</li>
    <li>Message: ${message}</li>
    <li>Type: ${type}</li>
  </ul>`;
};

// Api FreeWaves evento procesado:
const appendApi = (e) => {
  console.log("eventos de la api", e);
  if (e.message === undefined) {
    console.error("error", e.code); // error desconocido
  } else {
    error.innerHTML = `Error en enviar el formulario : ${e.message}`;
    setTimeout(() => {
      error.innerHTML = ``;
    }, 3000);
  }
  const EVENTO = e.map((evento) => {
    console.log(`map de los eventos:(cantidad:${e.length})`, evento);
    const { name, image, message, type, count, timestamp } = evento;
    ventana_api.innerHTML = ` <ul>
    <li>Name:${name}</li>
    <li>Image: ${image}</li>s
    <li>Message: ${message}</li>
    <li>Type: ${type}</li>
    <li>Count: ${count}</li>
    <li>Timestamp: ${timestamp}</li>
  </ul>`;
  });
};

// Brodcast FreeWaves evento procesado
const brEventAct = (e) => {
  // console.log("EVENTO ACTUALIZADO", e)
  const EVENTO_ACT = e.map((evento) => {
    console.log(
      `Broadcast del evento ACTUALIZADO:(cantidad:${e.length})`,
      evento
    );
    const { name, image, message, type, count, timestamp } = evento;
    ventana_br_ACT.innerHTML = ` <ul>
    <li>Name:${name}</li>
    <li>Image: ${image}</li>s
    <li>Message: ${message}</li>
    <li>Type: ${type}</li>
    <li>Count: ${count}</li>
    <li>Timestamp: ${timestamp}</li>
  </ul>`;
  });
};
