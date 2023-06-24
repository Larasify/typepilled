import express from "express";
import http from "http";
import cors from "cors";

import { Server, Socket } from "socket.io";
import {
  createRoomHandler,
  joinRoomHander,
  leaveRoomHandler,
  updateRoomHandler,
  endGameHander,
  startGameHander,
} from "./roomHandler";
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
    preferences: PreferenceState;
  };
};

export type PlayerState = {
  [key: string]: string[];
};

export type Chat = {
  username: string;
  id: string;
  message: string;
  type: "notification" | "chat";
  roomId: string;
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
    socket.emit("message", message);
    socket.join("multiplayerPage");
  });

  socket.on("send chat", ({ username, id, message, type, roomId }: Chat) => {
    io.to(roomId).emit("receive chat", { username, id, message, type, roomId });
  });

  const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
  io.to("multiplayerPage").emit("online users", sockets.length);

  socket.on("get online users", () => {
    const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
    socket.emit("online users", sockets.length);
  });

  

  updateRoomHandler(socket);
  createRoomHandler(socket);
  joinRoomHander(socket);
  leaveRoomHandler(socket);
  startGameHander(socket);
  endGameHander(socket);
  disconnectHandler(socket);

});

server.listen(8080, () => {
  console.log("started listening on port:8080");
});


export const disconnectHandler = (socket: Socket) => {
  socket.on("disconnect", () => {
    // disconnected client id
    const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
    io.to("multiplayerPage").emit("online users", sockets.length);

    // the rooms player is currently in
    const disconnectPlayerFrom = playerRooms[socket.id];
    if (!disconnectPlayerFrom) return;
    disconnectPlayerFrom.forEach((roomId) => {
      if (!rooms[roomId]) return;
      const players = rooms[roomId].players;
      rooms[roomId].players = players.filter((player) => {
        if (player.id === socket.id) {
          io.to(roomId).emit("receive chat", {
            username: player.username,
            id: player.id,
            message: `${player.username} has left the room`,
            type: "notification",
            roomId,
          });
        }
        return player.id !== socket.id;
      });

      io.in(roomId).emit("room update", rooms[roomId].players);
      if (rooms[roomId].players.length === 0) {
        delete rooms[roomId];
      }
    });
      // remove player
      delete playerRooms[socket.id];
    });
}
