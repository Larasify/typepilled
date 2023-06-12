import express from 'express';
import http from "http";
import cors from "cors";

import { Server } from "socket.io";

import { Request, Response } from 'express';


const app = express();
app.use(cors);
const server = http.createServer(app);
const io = new Server(server,{
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
})