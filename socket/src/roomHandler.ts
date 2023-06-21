import { Socket } from "socket.io";
import { io, playerRooms, rooms, type Player } from "./index";
import { PreferenceState, getWords } from "./utils/getWords";


export const createRoomHandler = (socket: Socket) => {
	socket.on("create room", (roomId: string, preferences:PreferenceState ) => {
		if (io.sockets.adapter.rooms.get(roomId)) {
			socket.emit("room already exist");
		} else {
            console.log("room created: ", roomId);

			const text = getWords(preferences).join(" ");

			rooms[roomId] = {
				players: [],
				text,
				inGame: false,
				winner: null,
				preferences,
			};

			socket.emit("words generated", rooms[roomId].text);
			socket.emit("create room success", roomId);

			// console.log(roomId);
			// console.log(io.sockets.adapter.rooms.get(roomId));
			// const sockets = Array.from(io.sockets.sockets).map((socket) => socket[0]);
			// console.log("room created: ", socket.rooms);

		}
	});
};

export const updateRoomHandler = (socket: Socket) => {
	socket.on("room update", (user: Player) => {
		const { roomId } = user;
		if (!rooms[roomId]) return;
		const players = rooms[roomId].players;
		rooms[roomId].players = players.map((player) => (player.id !== user.id ? player : user));
		io.in(roomId).emit("room update", rooms[roomId].players);

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

export const joinRoomHander = (socket: Socket) => {
	socket.on("join room", ({ roomId, user }: { roomId: string; user: Player }) => {
		socket.emit("end game");
		const room = rooms[roomId];

		if (!room) {
			socket.emit("room invalid");
			return;
		} else if (rooms[roomId].inGame) {
			socket.emit("room in game");
			return;
		}
		else if (rooms[roomId].players.some((player) => player.id === user.id)) return;
		else {
			rooms[roomId].players = [...rooms[roomId].players, user];
			playerRooms[socket.id] = [roomId];
		}


		socket.join(roomId);
		socket.emit("words generated", rooms[roomId].text);
		io.in(roomId).emit("room update", rooms[roomId].players);
		// socket.to(roomId).emit("notify", `${user.username} is here.`);
		io.in(roomId).emit("receive chat", { username: user.username, value: "joined", id: user.id, type: "notification" });
	});
};

export const leaveRoomHandler = (socket: Socket) => {
	socket.on("leave room", (user: Player) => {
		const { roomId } = user;
		const players = rooms[roomId];
		if (!players) return;
		rooms[roomId].players = players.players.filter((player) => {
			if (player.id === user.id) {
				socket.to(roomId).emit("leave room", player.username);
				io.in(roomId).emit("receive chat", { username: player.username, value: "left", id: player.id });
			}
			return player.id !== user.id;
		});

		io.in(roomId).emit("room update", rooms[roomId].players);
		if (rooms[roomId].players.length === 0) {
			console.log("room deleted: ", roomId);
			delete rooms[roomId];
		}
	});
};
