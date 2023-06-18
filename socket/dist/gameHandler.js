"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGameHander = exports.endGameHander = void 0;
const index_1 = require("./index");
const getWords_1 = require("./utils/getWords");
const endGameHander = (socket) => {
    socket.on("end game", (roomId) => {
        const preferences = index_1.rooms[roomId].preferences;
        const text = (0, getWords_1.getWords)(preferences).join(" ");
        index_1.rooms[roomId] = {
            players: index_1.rooms[roomId].players,
            text,
            inGame: false,
            winner: socket.id,
            preferences,
        };
        // console.log(socket.id);
        // io.in(roomId).emit("winner", rooms[roomId].winner);
        index_1.io.in(roomId).emit("end game", socket.id);
    });
};
exports.endGameHander = endGameHander;
const startGameHander = (socket) => {
    socket.on("start game", (roomId) => {
        index_1.io.in(roomId).emit("words generated", index_1.rooms[roomId].text);
        index_1.io.in(roomId).emit("start game");
        index_1.rooms[roomId].inGame = true;
    });
};
exports.startGameHander = startGameHander;
//# sourceMappingURL=gameHandler.js.map