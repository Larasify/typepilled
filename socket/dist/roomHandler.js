"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGameHander = exports.endGameHander = exports.leaveRoomHandler = exports.joinRoomHander = exports.updateRoomHandler = exports.createRoomHandler = void 0;
const index_1 = require("./index");
const getWords_1 = require("./utils/getWords");
const createRoomHandler = (socket) => {
    socket.on("create room", (roomId, preferences) => {
        if (index_1.io.sockets.adapter.rooms.get(roomId)) {
            socket.emit("room already exist");
        }
        else {
            console.log("room created: ", roomId);
            console.log("room count: ", index_1.io.sockets.adapter.rooms.size);
            const text = (0, getWords_1.getWords)(preferences).join(" ");
            index_1.rooms[roomId] = {
                players: [],
                text,
                inGame: false,
                winner: null,
                preferences,
            };
            socket.emit("words generated", index_1.rooms[roomId].text);
            socket.emit("create room success", roomId);
        }
    });
};
exports.createRoomHandler = createRoomHandler;
const updateRoomHandler = (socket) => {
    socket.on("room update", (user) => {
        const { roomId } = user;
        if (!index_1.rooms[roomId])
            return;
        const players = index_1.rooms[roomId].players;
        index_1.rooms[roomId].players = players.map((player) => (player.id !== user.id ? player : user));
        index_1.io.in(roomId).emit("room update", index_1.rooms[roomId].players);
    });
};
exports.updateRoomHandler = updateRoomHandler;
const joinRoomHander = (socket) => {
    socket.on("join room", ({ roomId, user }) => {
        socket.emit("end game");
        const room = index_1.rooms[roomId];
        if (!room) {
            socket.emit("room invalid");
            return;
        }
        else if (index_1.rooms[roomId].inGame) {
            socket.emit("room in game");
            return;
        }
        else if (index_1.rooms[roomId].players.some((player) => player.id === user.id))
            return;
        else {
            index_1.rooms[roomId].players = [...index_1.rooms[roomId].players, user];
            index_1.playerRooms[socket.id] = [roomId];
        }
        socket.join(roomId);
        socket.emit("words generated", index_1.rooms[roomId].text);
        index_1.io.in(roomId).emit("room update", index_1.rooms[roomId].players);
        index_1.io.to(roomId).emit("receive chat", { username: user.username, id: user.id, message: `${user.username} has joined the room`, type: "notification", roomId });
    });
};
exports.joinRoomHander = joinRoomHander;
const leaveRoomHandler = (socket) => {
    socket.on("leave room", (user) => {
        const { roomId } = user;
        const players = index_1.rooms[roomId];
        if (!players)
            return;
        index_1.rooms[roomId].players = players.players.filter((player) => {
            if (player.id === user.id) {
                socket.to(roomId).emit("leave room", player.username);
                index_1.io.to(roomId).emit("receive chat", { username: user.username, id: user.id, message: `${user.username} has left the room`, type: "notification", roomId });
            }
            return player.id !== user.id;
        });
        index_1.io.in(roomId).emit("room update", index_1.rooms[roomId].players);
        if (index_1.rooms[roomId].players.length === 0) {
            console.log("room deleted: ", roomId);
            delete index_1.rooms[roomId];
        }
    });
};
exports.leaveRoomHandler = leaveRoomHandler;
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
//# sourceMappingURL=roomHandler.js.map