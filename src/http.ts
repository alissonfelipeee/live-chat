import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(express.static("public"));

export const serverHttp = http.createServer(app);

export const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});
