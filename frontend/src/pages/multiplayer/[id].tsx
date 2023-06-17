import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useRoomContext } from "~/context/Room/RoomContext";
import { type Player } from "../../context/Room/RoomContext";
import toast from "react-hot-toast";
import RoomCode from "~/components/Multiplayer/RoomCode";
import Players from "~/components/Multiplayer/Players";
import MultiplayerGame from "~/components/Multiplayer/MultiplayerGame";

export default function GameRoom() {
  console.log("game room");

  const {
    room: { socket, user, type, text, players, isPlaying, winner },
    timeBeforeRestart,
    dispatch,
    resetTime,
  } = useRoomContext();
  const router = useRouter();
  useEffect(() => {
    console.log(players);
  }, [players]);

  useEffect(() => {
    if (user.id && router?.query?.id) {
      socket.emit("join room", { roomId: router?.query?.id, user });
      dispatch({ type: "SET_ROOM_ID", payload: router?.query?.id as string });

      socket.off("room update").on("room update", (players: Player[]) => {
        dispatch({ type: "SET_PLAYERS", payload: players });
      });

      socket.off("start game").on("start game", () => {
        dispatch({ type: "SET_STATUS", payload: { progress: 0, wpm: 0 } });
        dispatch({ type: "SET_IS_FINISHED", payload: false });
        dispatch({ type: "SET_WINNER", payload: null });
        void resetTime(5).then(() =>
          dispatch({ type: "SET_IS_READY", payload: true })
        );
      });

      dispatch({ type: "SET_STATUS", payload: { progress: 0, wpm: 0 } });
      dispatch({ type: "SET_IS_READY", payload: false });
      dispatch({ type: "SET_IS_PLAYING", payload: false });
      dispatch({ type: "SET_IS_FINISHED", payload: false });
      dispatch({ type: "SET_WINNER", payload: null });
      void resetTime(0);

      socket.off("end game").on("end game", (playerId: string) => {
        dispatch({ type: "SET_IS_PLAYING", payload: false });
        dispatch({ type: "SET_WINNER", payload: playerId });
        dispatch({ type: "SET_IS_READY", payload: false });
      });

      socket.off("room invalid").on("room invalid", () => {
        toast.error("Invalid room code", {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
        void router.push("/multiplayer");
      });

      socket.off("room in game").on("room in game", () => {
        toast.error("Room is currently in a game", {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
        void router.push("/multiplayer");
      });

      socket.off("words generated").on("words generated", (text: string) => {
        dispatch({ type: "SET_TEXT", payload: text });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, user.id]);

  
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    isPlaying && ref.current?.focus();
    !isPlaying && ref.current?.blur();
  }, [isPlaying]);

  return (
    <>
    <Players />
      <RoomCode />
       
      <MultiplayerGame ref={ref}  />
    </>
  );
}
