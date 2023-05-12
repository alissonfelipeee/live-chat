import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
export const serverHttp = http.createServer(app);

export const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});
