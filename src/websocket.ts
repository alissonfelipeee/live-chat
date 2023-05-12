import { io } from "./http";

interface RoomUser {
  socketId: string;
  username: string;
  room: string;
}

interface Message {
  room: string;
  username: string;
  message: string;
  createdAt: Date;
}

const users: RoomUser[] = [];

const messages: Message[] = [];

io.on("connection", (socket) => {
  socket.on("select_room", (data, callback) => {
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socketId = socket.id;
    } else {
      users.push({
        socketId: socket.id,
        username: data.username,
        room: data.room,
      });
    }

    const messagesRoom = getMessagesRoom(data.room);
    callback(messagesRoom);
  });

  socket.on("message", (data) => {
    const message: Message = {
      room: data.room,
      username: data.username,
      message: data.message,
      createdAt: new Date(),
    };

    messages.push(message);

    io.to(data.room).emit("message", message);
  });
});

function getMessagesRoom(room: string) {
  const roomMessages = messages.filter((message) => message.room === room);

  return roomMessages;
}
