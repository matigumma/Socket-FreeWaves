const ventana_br = document.querySelector("#ventana_br");
const ventana_send = document.querySelector("#ventana_send");
const ventana_api = document.querySelector("#ventana_api");

const appendEvent = (e) => {
  console.log(e);
  const { name, image, message, type, id } = e;
  ventana_br.innerHTML = ` <ul>
  <li>Name:${name}</li>
  <li>Image: ${image}</li>
  <li>Message: ${message}</li>
  <li>Type: ${type}</li>
  <li>Id: ${id}</li>
</ul>`;
};

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

const appendApi = (e) => {
  console.log(e)
  const { name, image, message, type, count, timestamp } = e;
  ventana_api.innerHTML += ` <ul>
  <li>Name:${name}</li>
  <li>Image: ${image}</li>
  <li>Message: ${message}</li>
  <li>Type: ${type}</li>
  <li>Count: ${count}</li>
  <li>Timestamp: ${timestamp}</li>
</ul>`;
};
