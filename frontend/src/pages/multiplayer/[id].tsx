import { useRoomContext } from "~/context/Room/RoomContext";

export default function GameRoom() {
  console.log("game room")
  const { room } = useRoomContext();
  console.log(room);
  return (<div>{room.type+" "+room.user.id}</div>);
}
