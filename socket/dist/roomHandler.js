"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoomHandler = exports.joinRoomHander = exports.updateRoomHandler = exports.createRoomHandler = void 0;
const index_1 = require("./index");
const getWords_1 = require("./utils/getWords");
const createRoomHandler = (socket) => {
    socket.on("create room", (roomId, preferences) => {
        console.log(":3");
        if (index_1.io.sockets.adapter.rooms.get(roomId)) {
            socket.emit("room already exist");
        }
        else {
            console.log("room created: ", roomId);
            const text = (0, getWords_1.getWords)(preferences).join(" ");
            index_1.rooms[roomId] = {
                players: [],
                text,
                inGame: false,
                winner: null,
            };
            console.log("oncreate", index_1.rooms);
            socket.emit("words generated", index_1.rooms[roomId].text);
            socket.emit("create room success", roomId);
            // console.log(roomId);
            // console.log(io.sockets.adapter.rooms.get(roomId));
            // const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
            // console.log("room created: ", socket.rooms);
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
        console.log("onupdate", index_1.rooms);
        // start game
        // const allPlayersReady = rooms[roomId].players.every((player) => player.isReady);
        // if (allPlayersReady) {
        // 	io.in(roomId).emit("start game");
        // 	rooms[roomId].inGame = true;
        // } else {
        // 	rooms[roomId].inGame = false;
        // }
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
        console.log("onjoin", index_1.rooms);
        socket.join(roomId);
        socket.emit("words generated", index_1.rooms[roomId].text);
        index_1.io.in(roomId).emit("room update", index_1.rooms[roomId].players);
        // socket.to(roomId).emit("notify", `${user.username} is here.`);
        index_1.io.in(roomId).emit("receive chat", { username: user.username, value: "joined", id: user.id, type: "notification" });
        // console.log("join", rooms);
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
                index_1.io.in(roomId).emit("receive chat", { username: player.username, value: "left", id: player.id });
                console.log("onleave", index_1.rooms);
            }
            return player.id !== user.id;
        });
        index_1.io.in(roomId).emit("room update", index_1.rooms[roomId].players);
        if (index_1.rooms[roomId].players.length === 0) {
            delete index_1.rooms[roomId];
        }
        // console.log("leave ", rooms);
    });
};
exports.leaveRoomHandler = leaveRoomHandler;
//# sourceMappingURL=roomHandler.js.map