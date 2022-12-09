const name_api = document.querySelector("#name");
const image_api = document.querySelector("#image");
const type_api = document.querySelector("#type");
const message_api = document.querySelector("#message");
const btn_enviar_api = document.querySelector("#api_evento");

btn_enviar_api.addEventListener("click", async (e) => {
  // console.log(name_api.value, image_api.value)
  e.preventDefault();
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
    //   console.log("Success:", response);
      appendApi(response)
    })
    .catch((error) => console.log("Error:", error));
});
