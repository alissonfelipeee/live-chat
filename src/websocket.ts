import { io } from "./http";

interface RoomUser {
  socketId: string;
  username: string;
  room: string;
}

const users: RoomUser[] = [];

io.on("connection", (socket) => {
  socket.on("select_room", (data) => {
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
  });
});
