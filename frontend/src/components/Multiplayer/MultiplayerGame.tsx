import clsx from "clsx";
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useMemo,
  type CSSProperties,
} from "react";
import useTypingGame, { CharStateType } from "react-typing-game-hook";
import { GiArrowCursor } from "react-icons/gi";
import { BsQuote } from "react-icons/bs";
import { useRoomContext } from "~/context/Room/RoomContext";

type TypingInputProps = React.ComponentPropsWithRef<'input'>;


const MultiplayerGame = forwardRef<HTMLInputElement, TypingInputProps>(function MultiplayerGame(
    {className},
    ref 
) {
  const [duration, setDuration] = useState(() => 0);
  const [isFocused, setIsFocused] = useState(() => false);
  const letterElements = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const {
    room: {
      text,
      isPlaying,
      isFinished,
      isChatOpen,
      socket,
      winner,
      type,
      user: { roomId, id, isOwner },
    },
    dispatch,
    timeBeforeRestart,
  } = useRoomContext();

  useEffect(() => {
    let progress = Math.floor(((currIndex + 1) / text.length) * 100);
    const wpm =
      duration === 0
        ? Math.ceil(((60 / currentTime) * correctChar) / 5)
        : Math.ceil(((60 / duration) * correctChar) / 5);

    if (isFinished) {
      progress = 100;
      !winner && socket.emit("end game", roomId, type);
    }

    dispatch({ type: "SET_STATUS", payload: { wpm, progress } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, isFinished]);

  //get game hook
  const {
    states: {
      charsState,
      chars,
      currIndex,
      phase,
      correctChar,
      errorChar,
      startTime,
      endTime,
    },
    actions: { insertTyping, resetTyping, deleteTyping, endTyping },
  } = useTypingGame(text, {
    skipCurrentWordOnSpace: false,
    pauseOnError: true,
  });

  const [margin, setMargin] = useState(() => 0);

  // set cursor
  const pos = useMemo(() => {
    if (text.length !== 0 && currIndex + 1 === text.length) {
      dispatch({ type: "SET_IS_FINISHED", payload: true });
    }
    if (
      currIndex !== -1 &&
      letterElements.current &&
      currIndex < chars.length - 1
    ) {
      const nextspan: any = letterElements.current.children[currIndex + 1];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const nexttop = nextspan.offsetTop - 2;
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-member-access
      const nextleft = nextspan.offsetLeft + nextspan.offsetWidth - 2;

      const spanref: any = letterElements.current.children[currIndex];
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-member-access
      const left = spanref.offsetLeft + spanref.offsetWidth - 2;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const top = spanref.offsetTop - 2;

      //HANDLE WHEN LINE SWITCHES BACK AND MARGIN UP
      if (nexttop < 0 && top < 0) {
        setMargin((margin) => margin - 1);
        return {
          left: left,
          top: 2,
        };
      }
      //HANDLE WHEN LINE SWITCHES SO NEXT MARGIN
      if (nexttop > 60 && nextleft < 15) {
        setMargin((margin) => margin + 1);
        return {
          left: -2,
          top: nexttop / 2,
        };
      }
      //HANDLE LINE SWITCHES WITHOUT MARGIN CHANGE
      else if (
        nexttop > 30 &&
        top < 30 &&
        chars.split("").at(currIndex) == " " &&
        nextleft < 15
      ) {
        console.log("middle work");
        return {
          left: -2,
          top: nexttop,
        };
      }
      return { left, top };
    } else {
      return {
        left: -2,
        top: 2,
      };
    }
  }, [currIndex]);

  //set WPM
  useEffect(() => {
    if (phase === 2 && endTime && startTime) {
      const dur = Math.floor((endTime - startTime) / 1000);
      setDuration(dur);
    } else {
      setDuration(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, startTime, endTime, ref]);

  //handle key presses
  const handleKeyDown = (letter: string, control: boolean) => {
    if (letter === "Backspace") {
        
      deleteTyping(control);
    } else if (letter.length === 1) {
      insertTyping(letter);
    }
  };

  //reset game when text changes
  useEffect(() => {
    if (id && roomId) {
      socket.off("words generated").on("words generated", (words: string) => {
        dispatch({ type: "SET_TEXT", payload: text });
        setMargin(0);
        setCurrentTime(0);
        endTyping();
        resetTyping();
      });
    }
  }, [id, roomId]);

  //countdown timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (startTime) {
        setCurrentTime(() => Math.floor((Date.now() - startTime) / 1000));
      }
    }, 1000);
    if (phase === 2) {
      clearInterval(timerInterval);
    }

    return () => clearInterval(timerInterval);
  }, [startTime, phase]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBlur = () => {
    // Wait for 500 milliseconds before reducing opacity
    timeoutRef.current = setTimeout(() => {
      console.log("blur");
      setIsFocused(false);
    }, 500);
  };

  const handleFocus = () => {
    // Clear the timeout if the window gains focus before the timeout is triggered
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsFocused(true);
  };

  
  const [animated, setAnimated] = useState(() => false);
  return (
    <>
      <div className="relative w-full max-w-[1100px]">
        {/*Game*/}
        <div
          className="relative z-40 h-[140px] w-full text-2xl outline-none"
          onClick={() => {
            if (ref != null && typeof ref !== "function") {
              ref?.current?.focus();
            }
            setIsFocused(true);
          }}
        >
          {/*Input box overlay*/}
          <input
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e.key, e.ctrlKey)}
            onFocus={() => handleFocus()}
            onBlur={() => handleBlur()}
            className={`absolute left-0 top-0 z-20 h-full w-full cursor-default opacity-0`}
            id="input"
            autoComplete="off"
            ref={ref}
          />

          <div
            className={clsx(
              "absolute -bottom-1 z-10 h-8 w-full bg-gradient-to-t from-base-100 transition-all duration-200",
              { "opacity-0": !isFocused }
            )}
          ></div>
          <span
            className={clsx(
              "absolute z-20 flex h-full w-full cursor-default items-center justify-center text-primary opacity-0 transition-all duration-200",
              { "text-fg opacity-100 ": !isFocused }
            )}
          >
            <GiArrowCursor className="mt-1" /> Click here or start typing to
            focus
          </span>
          <div
            className={clsx(
              "absolute left-0 top-0 mb-4 h-full w-full overflow-hidden text-justify leading-relaxed tracking-wide transition-all duration-200",
              { "opacity-40 blur-[8px]": !isFocused }
            )}
          ></div>
          {/*Text*/}
          <div
            className={clsx(
              "absolute left-0 top-0 mb-4 h-full w-full overflow-hidden text-justify leading-relaxed tracking-wide transition-all duration-200",
              { "opacity-40 blur-[8px]": !isFocused }
            )}
          >
            <div
              ref={letterElements}
              style={
                margin > 0
                  ? {
                      marginTop: -(margin * 39),
                    }
                  : {
                      marginTop: 0,
                    }
              }
            >
              {text.split("").map((letter, index) => {
                const state = charsState[index];
                const color =
                  state === CharStateType.Incomplete || currIndex <= index-1 
                    ? "text-gray-500"
                    : state === CharStateType.Correct 
                    ? "text-gray-200"
                    : "text-red-500 border-b-2 border-hl border-red-500";
                return (
                  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                  <span key={letter + index} className={`${color}`}>
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>
          {/*Cursor*/}
          {phase !== 2 && isFocused ? (
            <span
              style={{
                left: pos.top < 0 ? -2 : pos.left,
                top: pos.top < 0 ? 2 : pos.top + 2,
              }}
              className={`caret absolute z-10 border-l-2 border-primary`}
            >
              &nbsp;
            </span>
          ) : null}
        </div>
        {/*Results*/}
        <p className="text-sm">
          {phase === 2 && startTime && endTime ? (
            <>
              <span className="mr-4 text-green-500">
                WPM: {Math.round(((60 / duration) * correctChar) / 5)}
              </span>
              <span className="mr-4 text-blue-500">
                Accuracy:{" "}
                {((correctChar / (correctChar + errorChar)) * 100).toFixed(2)}%
              </span>
              <span className="mr-4 text-yellow-500">
                Duration: {duration}s
              </span>
            </>
          ) : null}
        </p>
      </div>
    </>
  );
});

export default MultiplayerGame;
