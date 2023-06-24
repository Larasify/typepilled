import { Socket } from "socket.io";
import { io, rooms } from "./index";
import { PreferenceState, getWords } from "./utils/getWords";

export const endGameHander = (socket: Socket) => {
  socket.on("end game", (roomId: string) => {
    const preferences = rooms[roomId].preferences;
    const text = getWords(preferences).join(" ");
    rooms[roomId] = {
      players: rooms[roomId].players,
      text,
      inGame: false,
      winner: socket.id,
      preferences,
    };
    // console.log(socket.id);
    // io.in(roomId).emit("winner", rooms[roomId].winner);
    io.in(roomId).emit("end game", socket.id);
  });
};

export const startGameHander = (socket: Socket) => {
  socket.on("start game", (roomId: string) => {
    io.in(roomId).emit("words generated", rooms[roomId].text);
    io.in(roomId).emit("start game");
    rooms[roomId].inGame = true;
  });
};
