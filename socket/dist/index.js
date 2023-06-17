"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.rooms = exports.playerRooms = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const roomHandler_1 = require("./roomHandler");
exports.playerRooms = {};
// rooms will consist of key value pair, key being room id, pair being users inside that room and their corresponding data
exports.rooms = {};
const app = (0, express_1.default)();
app.use(cors_1.default);
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://typepilled.vercel.app"],
        methods: ["GET", "POST"],
    },
});
exports.io.on("connection", (socket) => {
    console.log("user is connected");
    socket.on("message", (message) => {
        exports.io.emit("message", message);
    });
    (0, roomHandler_1.joinRoomHander)(socket);
    (0, roomHandler_1.leaveRoomHandler)(socket);
    (0, roomHandler_1.createRoomHandler)(socket);
    (0, roomHandler_1.updateRoomHandler)(socket);
});
server.listen(8080, () => {
    console.log("started listening on port:8080");
});
//# sourceMappingURL=index.js.map