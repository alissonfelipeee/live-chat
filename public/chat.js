const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

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

  if (data.username === username) {
    messageDiv.innerHTML += `
    <li class="flex justify-end">
    <div
    class="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow"
  >
        <strong>${data.username}</strong> <span>${data.text} - ${dayjs(
      data.createdAt
    ).format("DD/MM HH:mm")}</span>
    </div>
      </li>
    `;
  } else {
    messageDiv.innerHTML += `
    <li class="flex justify-start">
    <div
    class="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow"
  >
        <strong>${data.username}</strong> <span>${data.text} - ${dayjs(
      data.createdAt
    ).format("DD/MM HH:mm")}</span>
    </div>
      </li>
    `;
  }
}

document.getElementById("logout").addEventListener("click", (event) => {
  window.location.href = "index.html";
});
