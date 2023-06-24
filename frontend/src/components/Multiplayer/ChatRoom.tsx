import clsx from "clsx";
import { useMemo, useRef, useState, useEffect } from "react";
import {
  FaAt,
  FaCommentAlt,
  FaCrown,
  FaHashtag,
  FaMedal,
  FaPaperPlane,
} from "react-icons/fa";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Chat, useRoomContext } from "~/context/Room/RoomContext";

dayjs.extend(relativeTime);

export default function ChatRoom() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [inputBoxValue, setInputBoxValue] = useState("");
  const [notification, setNotification] = useState(false);
  const {
    room: {
      chat,
      user: { username, roomId, id },
      socket,
    },
    dispatch,
  } = useRoomContext();

  useEffect(() => {
    socket
      .off("receive chat")
      .on("receive chat", ({ id, username, message, type, roomId }: Chat) => {
        dispatch({
          type: "ADD_CHAT",
          payload: {
            id,
            username,
            message,
            type,
            roomId,
            createdAt: new Date(),
          },
        });
        setNotification(true);
      });
  }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <>
      <dialog className="modal" ref={modalRef}>
        <form
          method="dialog"
          className="scrollbar modal-box flex h-full max-h-[32rem] w-screen max-w-screen-sm flex-col justify-between overflow-y-scroll pb-0 font-roboto"
        >
          <div>
            {chat.map((chat) => (
              <div key={chat.id + chat.createdAt.getTime().toString()}>
                {chat.type === "chat" ? (
                  <div className="chat chat-start">
                    <div className="chat-header flex gap-2 font-semibold">
                      {chat.username}
                      <time className="text-xs font-normal opacity-50">
                        {dayjs(chat.createdAt).fromNow()}
                      </time>
                    </div>
                    <div className="chat-bubble">{chat.message}</div>
                  </div>
                ) : (
                  <div className="text-center text-sm opacity-50">
                    {chat.message}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
          <div className="sticky bottom-0 z-50 bg-base-100 pb-4">
            <div>
              <input
                type="text"
                placeholder="Type your message here"
                className="input-bordered input mt-4 w-full rounded-md"
                value={inputBoxValue}
                onChange={(e) => {
                  setInputBoxValue(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (inputBoxValue !== "") {
                      socket.emit("send chat", {
                        username,
                        message: inputBoxValue,
                        roomId,
                        id,
                        type: "chat",
                      });
                      setInputBoxValue("");
                    }
                  }
                }}
              />
              <FaPaperPlane
                className={clsx(
                  "absolute right-8 top-8 text-lg transition-colors duration-200",
                  {
                    "cursor-not-allowed text-neutral-500": inputBoxValue === "",
                  },
                  {
                    "cursor-pointer hover:text-secondary": inputBoxValue !== "",
                  }
                )}
                onClick={() => {
                  if (inputBoxValue !== "") {
                    socket.emit("send chat", {
                      username,
                      message: inputBoxValue,
                      roomId,
                      id,
                      type: "chat",
                    });
                    setInputBoxValue("");
                  }
                }}
              />
            </div>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button className="cursor-default outline-none" onClick={() => setNotification(false)}>close</button>
        </form>
      </dialog>
      <div
        className="btn-primary btn relative w-max rounded-lg text-neutral-200"
        onClick={() => {
          modalRef.current?.showModal();
          setNotification(false);
        }}
      >
        {notification && (
          <div className="absolute right-[-8px] top-[-8px] h-4 w-4 rounded-full bg-red-500"></div>
        )}
        <FaCommentAlt className="text-xl" />
        Chat
      </div>
    </>
  );
}
