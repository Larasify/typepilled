import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
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

export default function ChatDrawer() {
  const drawerChatEnd = useRef<HTMLDivElement>(null);
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
    drawerChatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <>
      <div className="drawer drawer-end">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer"
            className="btn-primary btn relative w-max rounded-lg text-neutral-200"
            onClick={() => {
              setNotification(false);
            }}
          >
            {notification && (
              <div className="absolute right-[-8px] top-[-8px] h-4 w-4 rounded-full bg-red-500"></div>
            )}
            <FaCommentAlt className="text-xl" />
            Chat
          </label>
        </div>
        <div className="drawer-side z-50">
          <label
            htmlFor="my-drawer"
            className="drawer-overlay"
            onClick={() => setNotification(false)}
          ></label>
          <ul className="scrollbar menu flex h-full w-80 flex-col flex-nowrap justify-between overflow-y-scroll bg-base-100 p-4 pb-0 font-roboto">
            {/* Sidebar content here */}
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
              <div ref={drawerChatEnd}></div>
            </div>
            <div className="sticky bottom-0 z-50 h-max w-full bg-base-100 pb-4">
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
                    "absolute right-4 top-8 text-lg transition-colors duration-200",
                    {
                      "cursor-not-allowed text-neutral-500":
                        inputBoxValue === "",
                    },
                    {
                      "cursor-pointer hover:text-secondary":
                        inputBoxValue !== "",
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
          </ul>
        </div>
      </div>
    </>
  );
}
