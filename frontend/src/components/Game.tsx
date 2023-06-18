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
import { usePreferenceContext } from "~/context/Preference/PreferenceContext";

type ButtonProps = {
  text: string;
  time: number;
  reset: () => void;
};

const Game = forwardRef<HTMLInputElement, ButtonProps>(function Game(
  props,
  ref
) {
  const [duration, setDuration] = useState(() => 0);
  const [isFocused, setIsFocused] = useState(() => false);
  const letterElements = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState(props.time);
  const { preferences, dispatch } = usePreferenceContext();

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
  } = useTypingGame(props.text, { skipCurrentWordOnSpace: false });

  const [margin, setMargin] = useState(() => 0);

  // set cursor
  const pos = useMemo(() => {
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
    if (phase === 2) {
      if (preferences.type === "time") {
        setDuration(props.time - timeLeft);
      } else if (endTime && startTime) {
        setDuration(Math.floor((endTime - startTime) / 1000));
      }
    } else {
      setDuration(0);
    }
    /*
    if (phase === 2 && endTime && startTime) {
      setDuration(Math.floor((endTime - startTime) / 1000));
    } else {
      setDuration(0);
    }*/
  }, [phase, startTime, endTime]);

  //handle key presses
  const handleKeyDown = (letter: string, control: boolean) => {
    if (letter === "Escape") {
      if (ref) {
        props.reset();
      }
      resetTyping();
    } else if (letter === "Backspace") {
      deleteTyping(control);
    } else if (letter.length === 1) {
      insertTyping(letter);
    }
  };

  //focus once the page loads on the game
  useEffect(() => {
    //document.getElementById("input")?.focus();
    if (ref != null && typeof ref !== "function") {
      ref?.current?.focus();
    }
  }, []);

  //reset game when text changes
  useEffect(() => {
    setMargin(0);
    setTimeLeft(props.time);
    endTyping();
    resetTyping();
  }, [props.text, props.time]);

  //countdown timer
  useEffect(() => {
    if (preferences.type == "time") {
      const Timer = setInterval(() => {
        if (phase === 1 && isFocused) {
          setTimeLeft((currentTime) => {
            if (currentTime === 1) {
              clearInterval(Timer);
              endTyping();
            }
            return currentTime - 1;
          });
        }
      }, 1000);
      if (phase === 2) {
        clearInterval(Timer);
      }
      return () => clearInterval(Timer);
    }
  }, [startTime, phase, isFocused, preferences]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBlur = () => {
    // Wait for 500 milliseconds before reducing opacity
    timeoutRef.current = setTimeout(() => {
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
        {/*Timer*/}

        <div
          className={clsx("visible flex flex-row", {
            "invisible": preferences.type !== "time",
          })}
        >
          <div className="left-0 z-40 text-4xl text-primary">
            {animated ? (
              <span className="countdown">
                <span style={{ "--value": timeLeft } as CSSProperties}></span>
              </span>
            ) : (
              <span>{timeLeft}</span>
            )}
          </div>

          <button
            className={clsx("flex flex-row", {
              "text-primary ": animated,
            })}
            onClick={() => {
              setAnimated(!animated);
              if (ref != null && typeof ref !== "function") {
                ref?.current?.focus();
              }
            }}
          >
            <BsQuote className="mt-1" /> <span> Animated</span>{" "}
          </button>
        </div>

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
              { "opacity-100 ": !isFocused }
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
              {props.text.split("").map((letter, index) => {
                const state = charsState[index];
                const color =
                  state === CharStateType.Incomplete
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

export default Game;
