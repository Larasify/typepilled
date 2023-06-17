"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectHandler = void 0;
const index_1 = require("./index");
const disconnectHandler = (socket) => {
    socket.on("disconnect", () => {
        // disconnected client id
        // console.log("disconnected");
        const sockets = Array.from(index_1.io.sockets.sockets).map((socket) => socket[0]);
        // the rooms player is currently in
        const disconnectPlayerFrom = index_1.playerRooms[socket.id];
        if (!disconnectPlayerFrom)
            return;
        disconnectPlayerFrom.forEach((roomId) => {
            if (!index_1.rooms[roomId])
                return;
            const players = index_1.rooms[roomId].players;
            index_1.rooms[roomId].players = players.filter((player) => {
                if (player.id === socket.id) {
                    // io.in(roomId).emit("leave room", player.username);
                    index_1.io.in(roomId).emit("receive chat", { username: player.username, value: "left", id: player.id });
                }
                return player.id !== socket.id;
            });
            index_1.io.in(roomId).emit("room update", index_1.rooms[roomId].players);
            if (index_1.rooms[roomId].players.length === 0) {
                delete index_1.rooms[roomId];
            }
        });
        // remove player
        delete index_1.playerRooms[socket.id];
        // console.log("disconnect", rooms);
        // console.log(io.sockets.adapter.rooms);
    });
};
exports.disconnectHandler = disconnectHandler;
//# sourceMappingURL=disconnectHandler.js.map