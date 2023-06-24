"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectHandler = exports.rooms = exports.playerRooms = exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const roomHandler_1 = require("./roomHandler");
const app = (0, express_1.default)();
app.use(cors_1.default);
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://typepilled.vercel.app"],
        methods: ["GET", "POST"],
    },
});
exports.playerRooms = {};
// rooms will consist of key value pair, key being room id, pair being users inside that room and their corresponding data
exports.rooms = {};
exports.io.on("connection", (socket) => {
    console.log("user is connected");
    socket.on("message", (message) => {
        socket.emit("message", message);
        socket.join("multiplayerPage");
    });
    socket.on("send chat", ({ username, id, message, type, roomId }) => {
        exports.io.to(roomId).emit("receive chat", { username, id, message, type, roomId });
    });
    const sockets = Array.from(exports.io.sockets.sockets).map((socket) => socket[0]);
    exports.io.to("multiplayerPage").emit("online users", sockets.length);
    socket.on("get online users", () => {
        const sockets = Array.from(exports.io.sockets.sockets).map((socket) => socket[0]);
        socket.emit("online users", sockets.length);
    });
    (0, roomHandler_1.updateRoomHandler)(socket);
    (0, roomHandler_1.createRoomHandler)(socket);
    (0, roomHandler_1.joinRoomHander)(socket);
    (0, roomHandler_1.leaveRoomHandler)(socket);
    (0, roomHandler_1.startGameHander)(socket);
    (0, roomHandler_1.endGameHander)(socket);
    (0, exports.disconnectHandler)(socket);
});
server.listen(8080, () => {
    console.log("started listening on port:8080");
});
const disconnectHandler = (socket) => {
    socket.on("disconnect", () => {
        console.log("user disconnected");
        // disconnected client id
        const sockets = Array.from(exports.io.sockets.sockets).map((socket) => socket[0]);
        exports.io.to("multiplayerPage").emit("online users", sockets.length);
        // the rooms player is currently in
        const disconnectPlayerFrom = exports.playerRooms[socket.id];
        if (!disconnectPlayerFrom)
            return;
        disconnectPlayerFrom.forEach((roomId) => {
            if (!exports.rooms[roomId])
                return;
            const players = exports.rooms[roomId].players;
            exports.rooms[roomId].players = players.filter((player) => {
                if (player.id === socket.id) {
                    exports.io.to(roomId).emit("receive chat", {
                        username: player.username,
                        id: player.id,
                        message: `${player.username} has left the room`,
                        type: "notification",
                        roomId,
                    });
                }
                return player.id !== socket.id;
            });
            exports.io.in(roomId).emit("room update", exports.rooms[roomId].players);
            if (exports.rooms[roomId].players.length === 0) {
                delete exports.rooms[roomId];
            }
        });
        // remove player
        delete exports.playerRooms[socket.id];
    });
};
exports.disconnectHandler = disconnectHandler;
//# sourceMappingURL=index.js.map