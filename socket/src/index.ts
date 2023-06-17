import express from "express";
import http from "http";
import cors from "cors";

import { Server } from "socket.io";
import {
  createRoomHandler,
  joinRoomHander,
  leaveRoomHandler,
  updateRoomHandler,
} from "./roomHandler";
import { create } from "domain";
import { disconnectHandler } from "./disconnectHandler";
import { PreferenceState, getWords } from "./utils/getWords";

export type Player = {
  username: string;
  roomId: string;
  id: string;
  status: {
    wpm: number;
    progress: number;
  };
  isPlaying: boolean;
  isReady: boolean;
};

export type RoomState = {
  [key: string]: {
    text: string;
    players: Player[];
    inGame: boolean;
    winner: string | null;
  };
};

export type PlayerState = {
  [key: string]: string[];
};

const app = express();
app.use(cors);
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://typepilled.vercel.app"],
    methods: ["GET", "POST"],
  },
});

export const playerRooms: PlayerState = {};

// rooms will consist of key value pair, key being room id, pair being users inside that room and their corresponding data
export const rooms: RoomState = {};

io.on("connection", (socket) => {
  console.log("user is connected");

  socket.on("message", (message) => {
    io.emit("message", message);
  });

  updateRoomHandler(socket);
  createRoomHandler(socket);
  joinRoomHander(socket);
  leaveRoomHandler(socket);
  disconnectHandler(socket);
  
});

server.listen(8080, () => {
  console.log("started listening on port:8080");
});
