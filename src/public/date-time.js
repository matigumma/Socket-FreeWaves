
const name_api = document.querySelector("#name");
const image_api = document.querySelector("#image");
const type_api = document.querySelector("#type");
const message_api = document.querySelector("#message");
const btn_enviar_api = document.querySelector("#api_evento");

const EVENTO = async () => {
  const socket = io();
  await fetch("/date-time", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      name: name_api.value, //string
      image: image_api.value, //string
      message: message_api.value, //string
      type: type_api.value, // string
    }),
  })
    .then((res) => res.json())
    .then((response) => {
      //console.log("Success:", response);
      appendApi(response);
    })
    .catch((error) => console.error("Error:", error));
};

btn_enviar_api.addEventListener("click", async (e) => {
  e.preventDefault();
  EVENTO();
});
