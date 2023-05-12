const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

document.title = `Chat - ${room}`;

const usernameDiv = document.getElementById("username");
usernameDiv.innerHTML = `Olá <strong>${username}</strong> - Você está na sala <strong>${room}</strong>`;

socket.emit(
  "select_room",
  {
    username,
    room,
  },
  (messages) => {
    messages.forEach((message) => createMessage(message));
  }
);

document
  .getElementById("message_input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const message = event.target.value;

      const data = {
        room,
        message,
        username,
      };

      socket.emit("message", data);

      event.target.value = "";
    }
  });

document.getElementById("message_submit").addEventListener("click", (event) => {
  const message = document.getElementById("message_input");

  const data = {
    room,
    message: message.value,
    username,
  };

  socket.emit("message", data);

  message.value = "";
});

socket.on("message", (data) => {
  createMessage(data);
});

function createMessage(data) {
  const messageDiv = document.getElementById("messages");

  const ownerMessage =
    data.username === username ? "justify-end" : "justify-start";

  const backgroundMessage = data.username === username ? "bg-gray-100" : "";

  messageDiv.innerHTML += `
    <li class="flex ${ownerMessage}">
    <div
    class="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow ${backgroundMessage}"
  >
        <strong>${data.username}</strong> <span class="text-xs">${dayjs(
    data.createdAt
  ).format("HH:mm")}</span>
    <p>${data.message}</p>
    </div>
      </li>
    `;

  messageDiv.scrollIntoView({
    block: "end",
    behavior: "smooth",
  });
}

document.getElementById("logout").addEventListener("click", (event) => {
  window.location.href = "index.html";
});
