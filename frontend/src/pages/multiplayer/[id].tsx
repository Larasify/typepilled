import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useRoomContext } from "~/context/Room/RoomContext";
import { type Player } from "../../context/Room/RoomContext";
import toast from "react-hot-toast";
import RoomCode from "~/components/Multiplayer/RoomCode";
import Players from "~/components/Multiplayer/Players";
import MultiplayerGame from "~/components/Multiplayer/MultiplayerGame";
import { CgSpinner } from "react-icons/cg";

export default function GameRoom() {
  const {
    room: { socket, user, type, text, players, isPlaying, winner },
    timeBeforeRestart,
    dispatch,
    resetTime,
  } = useRoomContext();
  const router = useRouter();
  
  /*useEffect(() => {
    console.log(user, isPlaying);
    console.log(players);
  }, [players]);*/

  useEffect(() => {
    if (user.id && router?.query?.id) {
      const stri = router?.query?.id as string;
      socket.emit("join room", { roomId: router?.query?.id, user });
      dispatch({ type: "SET_ROOM_ID", payload: stri });

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

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (text.length > 0) setIsClient(true);
    setTimeout(() => setIsClient(true), 8000); //TODO: Make this timeout send them back to the multiplayer page
  }, [text]);

  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    isPlaying && ref.current?.focus();
    !isPlaying && ref.current?.blur();
  }, [isPlaying]);

  return (
    <>
      {!isClient ? (
        <>
          <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-base-100">
            <div className="flex max-w-[500px] flex-wrap items-center justify-center gap-x-8 ">
              <div className="flex flex-col items-center gap-4">
                <CgSpinner className="text-fg animate-spin text-[3rem] text-primary" />
                <div className="text-fg text-primary">
                  Connecting to multiplayer servers...
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <RoomCode />
          <Players />
          <div className="flex flex-col items-center pt-24 text-center">
            <MultiplayerGame ref={ref} />

            <button
              disabled={isPlaying || !user.isOwner || timeBeforeRestart > 0}
              onClick={() => {
                user.id &&
                  user.roomId &&
                  socket.emit("start game", user.roomId);
              }}
              className="btn-primary btn mt-2"
            >
              Start
            </button>
          </div>
        </>
      )}
    </>
  );
}
