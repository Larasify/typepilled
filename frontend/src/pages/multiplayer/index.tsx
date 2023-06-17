import { useRouter } from "next/router";
import { useState, useEffect, type FormEvent, useRef } from "react";
import { useRoomContext } from "~/context/Room/RoomContext";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import { FaArrowRight } from "react-icons/fa";
import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";
import { z } from "zod";
import MultiplayerOptions from "~/components/Multiplayer/MultiplayerOptions";

export default function Multiplayer() {
  const { room, dispatch, resetTime } = useRoomContext();
  const router = useRouter();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [isServerUp, setIsServerUp] = useState(false);

  const createRoom = () => {
    const id = v4().slice(0, 6);
    room.socket.emit("create room", id, {
      preferences: {
        type: room.type,
        wordlength: room.wordlength,
        quotelength: room.quotelength,
        punctuation: room.punctuation,
        numbers: room.numbers,
      },
    });
  };

  useEffect(() => {
    room.socket.emit("message", "hihihihihi");

    room.socket.off("message").on("message", (message: string) => {
      console.log(message);
      setIsServerUp(true);
    });

    room.socket.off("room id exists").on("room id exists", () => {
      createRoom();
    });

    room.socket
      .off("create room success")
      .on("create room success", (roomId: string, text: string) => {
        toast.success("Room Created", {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
        setIsCreatingRoom(false);

        dispatch({ type: "SET_ROOM_ID", payload: roomId });
        dispatch({ type: "SET_IS_OWNER", payload: true });
        void router
          .push(`/multiplayer/${roomId}`)
          .then(() => console.log("joined room"));
      });

    room.socket.off("end game").on("end game", () => {
      dispatch({ type: "SET_STATUS", payload: { progress: 0, wpm: 0 } });
      dispatch({ type: "SET_IS_READY", payload: false });
      dispatch({ type: "SET_IS_PLAYING", payload: false });
      dispatch({ type: "SET_IS_FINISHED", payload: false });
      dispatch({ type: "SET_WINNER", payload: null });
      void resetTime(0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const codeRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (codeRef && codeRef.current) {
      const roomCode = codeRef.current.value;
      //console.log(roomCode);
      codeRef.current.value = "";

      const result = z.string().min(6).max(6).safeParse(roomCode);
      if (!result.success) {
        toast.error("Invalid room code", {
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
        return;
      } else {
        setIsJoiningRoom(true);
        void router.push(`/multiplayer/${roomCode}`);
      }
    }
  };

  if (!isServerUp)
    return (
      <div className="m-auto flex h-full max-w-lg flex-col items-center justify-center align-middle">
        <div className="loading text-2xl text-primary"></div>
        <div className="text-secondary">Trying to connect ...</div>
      </div>
    );

  return (
    <main>
      <section>
        <span className=" mx-auto mt-5 flex justify-center font-mono text-3xl text-secondary">
          multiplayer
        </span>
        <MultiplayerOptions />

        <div className="mt-10 flex min-h-[65vh] w-full flex-col items-center text-center">
          <div className="flex w-full flex-col gap-4">
            <form onSubmit={handleSubmit}>
              <div className="mx-auto flex max-w-[330px] justify-center gap-2">
                <input
                  name="code"
                  id="code"
                  autoComplete="off"
                  placeholder="enter room code"
                  className="flex-1 rounded"
                  ref={codeRef}
                />
                <button
                  disabled={isJoiningRoom}
                  type="submit"
                  className={`h-10 w-12 place-items-center rounded-l-none`}
                >
                  <FaArrowRight className="text-bg" />
                </button>
              </div>
            </form>

            <span className="text-3xl font-bold">or</span>
            <div className="flex items-center justify-center space-x-4">
              <button
                className="mt-5 rounded border border-secondary bg-base-100 px-8 py-4 font-mono text-xl font-normal text-secondary transition-colors duration-300 hover:text-secondary active:bg-secondary active:text-neutral"
                onClick={() => {
                  setIsCreatingRoom(true);
                  createRoom();
                }}
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? (
                  <span className="flex items-center">
                    Creating room
                    <CgSpinner className="ml-2 animate-spin" />
                  </span>
                ) : (
                  "Create New Room"
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
