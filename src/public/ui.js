const ventana_br = document.querySelector("#ventana_br");
const ventana_send = document.querySelector("#ventana_send");
const ventana_api = document.querySelector("#ventana_api");
const error = document.querySelector("#error");
const ventana_br_ACT = document.querySelector("#ventana_br_ACT");

// Broadcast del evento sin procesar:
const brEvent = (dataEvento) => {
  // console.log(e);
  const { name, image, message, type, id } = dataEvento;
  ventana_br.innerHTML = ` <ul>
  <li>Name:${name}</li>
  <li>Image: ${image}</li>
  <li>Message: ${message}</li>
  <li>Type: ${type}</li>
  <li>Id: ${id}</li>
</ul>`;
};

// Brodcast FreeWaves evento procesado
const brEventProceced = (dataEventoProcesado) => {
  // console.log("EVENTO ACTUALIZADO", dataEventoProcesado)
  // const EVENTO_ACT = dataEventoProcesado.map((evento) => {
  console.log(
    `Broadcast del evento ACTUALIZADO:(cantidad:${dataEventoProcesado.length})`,
    dataEventoProcesado
  );
  const { name, image, message, type, count, timestamp } =
    dataEventoProcesado[0];
  ventana_br_ACT.innerHTML = ` <ul>
    <li>Name:${name}</li>
    <li>Image: ${image}</li>
    <li>Message: ${message}</li>
    <li>Type: ${type}</li>
    <li>Count: ${count}</li>
    <li>Timestamp: ${timestamp}</li>
    </ul>`;
  // });
};
