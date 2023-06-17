import { useRouter } from "next/router";
import * as React from "react";
import { io, type Socket } from "socket.io-client";
import { animals, uniqueNamesGenerator } from "unique-names-generator";
import { useSession } from "next-auth/react";
import reducer from "./roomReducer";
import { useEffect, useReducer } from "react";

export type Player = {
  username: string;
  isOwner: boolean;
  roomId: string | null;
  id: string;
  status: {
    wpm: number;
    progress: number;
  };
  isReady: boolean;
};

export type RoomState = {
  user: Player;
  type: "words" | "quote";
  wordlength: string;
  quotelength: string;
  punctuation: boolean;
  numbers: boolean;
  isFinished: boolean;
  isPlaying: boolean;
  isChatOpen: boolean;
  text: string;
  players: Player[];
  socket: Socket;
  winner: string | null;
};

export type RoomContextValues = {
  room: RoomState;
  dispatch: React.Dispatch<Action>;
  timeBeforeRestart: number;
  resetTime: (time: number) => Promise<void>;
};

export type Action =
  | { type: "SET_ROOM_ID"; payload: string | null }
  | { type: "SET_TYPE"; payload: "words" | "quote" }
  | { type: "SET_WORDLENGTH"; payload: string }
  | { type: "SET_QUOTELENGTH"; payload: string }
  | { type: "SET_PUNCTUATION"; payload: boolean }
  | { type: "SET_NUMBERS"; payload: boolean }
  | { type: "SET_TEXT"; payload: string }
  | { type: "SET_IS_OWNER"; payload: boolean }
  | { type: "SET_USER_ID"; payload: string }
  | {
      type: "SET_STATUS";
      payload: {
        wpm: number;
        progress: number;
      };
    }
  | { type: "SET_NICKNAME"; payload: string }
  | { type: "SET_PLAYERS"; payload: Player[] }
  | { type: "SET_WINNER"; payload: string | null }
  | { type: "SET_IS_PLAYING"; payload: boolean }
  | { type: "TOGGLE_CHAT" }
  | { type: "SET_IS_READY"; payload: boolean }
  | { type: "SET_IS_FINISHED"; payload: boolean };

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080",
  {
    autoConnect: false,
  }
);

const RoomContext = React.createContext({} as RoomContextValues);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  const [room, dispatch] = useReducer(reducer, {
    text: "",
    type: "words",
    wordlength: "25",
    quotelength: "medium",
    punctuation: false,
    numbers: false,
    isPlaying: false,
    isFinished: false,
    isChatOpen: false,
    winner: null,
    user: {
      isOwner: false,
      roomId: null,
      username: uniqueNamesGenerator({
        dictionaries: [animals],
        style: "lowerCase",
      }),
      id: "",
      status: {
        wpm: 0,
        progress: 0,
      },
      isReady: false,
    },
    players: [],
    socket,
  });

  useEffect(() => {
    if (session?.user?.name) {
      dispatch({ type: "SET_NICKNAME", payload: session.user.name });
    }
  }, [session?.user?.name]);

  /*
  React.useEffect(() => {
    if (typeof window !== undefined) {
      const nickname = window.localStorage.getItem("nickname");
      if (nickname) dispatch({ type: "SET_NICKNAME", payload: nickname });
      /* IF YOU WANT PERSISTENT RANDOM NICKNAMES
      else {
        const newNickname = uniqueNamesGenerator({
          dictionaries: [animals],
          style: "lowerCase",
        });
        dispatch({ type: "SET_NICKNAME", payload: newNickname });
      }
    }
  }, []);
  */
  const [timeBeforeRestart, setTimeBeforeRestart] = React.useState(() => 0);

  // eslint-disable-next-line @typescript-eslint/require-await
  const resetTime = async (time: number) => setTimeBeforeRestart(time);

  React.useEffect(() => {
    const dispatchTimeout = setTimeout(() => {
      room.user.isReady && dispatch({ type: "SET_IS_PLAYING", payload: true });
    }, 5000);

    const restartInterval = setInterval(() => {
      if (room.user.isReady) {
        setTimeBeforeRestart((previousTime) => {
          if (previousTime === 0) {
            clearInterval(restartInterval);
          }
          return previousTime - 1;
        });
      }
    }, 1000);

    return () => {
      clearInterval(restartInterval);
      clearTimeout(dispatchTimeout);
    };
  }, [room.user.isReady]);

  const router = useRouter();

  socket.on("connect", () => {
    dispatch({ type: "SET_USER_ID", payload: socket.id });
  });

  socket.on("disconnect", () => {
    dispatch({ type: "SET_IS_READY", payload: false });
    dispatch({ type: "SET_ROOM_ID", payload: null });
  });

  React.useEffect(() => {
    if (room.user.id && room.user.roomId) {
      socket.emit("room update", room.user);
    }

    if (
      router.query.id !== room.user.roomId &&
      room.user.roomId &&
      room.user.id
    ) {
      socket.emit("leave room", room.user);
    }
  }, [router.pathname]);

  useEffect(() => {
    if (room.socket.connected) return;
    socket.connect();
  }, [room.socket.connected]);

  return (
    <RoomContext.Provider
      value={{ room, dispatch, timeBeforeRestart, resetTime }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => React.useContext(RoomContext);
