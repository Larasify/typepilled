"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use(cors_1.default);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
        ],
        methods: ["GET", "POST"],
    },
});
io.on("connection", (socket) => {
    console.log("user is connected");
    socket.on('message', (message) => {
        console.log(message);
        io.emit('message', "hiya");
    });
});
server.listen(8080, () => {
    console.log("started listening on port:8080");
});
//# sourceMappingURL=index.js.map