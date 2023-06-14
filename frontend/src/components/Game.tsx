import clsx from "clsx";
import { forwardRef, useEffect, useRef, useState, useMemo } from "react";
import useTypingGame, { CharStateType } from "react-typing-game-hook";

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
      setDuration(Math.floor((endTime - startTime) / 1000));
    } else {
      setDuration(0);
    }
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
    letterElements.current?.parentElement?.focus();
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
  }, [startTime, phase, isFocused]);

  return (
    <>
      <div className="relative w-full max-w-[950px]">
        {/*Timer*/}
        <span className="text-fg/80 absolute -top-[3.25rem] left-0 z-40 text-4xl text-primary-color">
          {timeLeft}
        </span>
        {/*Game*/}
        <div className="relative z-40 h-[140px] w-full text-2xl outline-none">
          {/*Input box overlay*/}
          <input
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e.key, e.ctrlKey)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`absolute left-0 top-0 z-20 h-full w-full cursor-default opacity-0`}
            ref={ref}
          />
          {/*Text*/}
          <div className="absolute left-0 top-0 mb-4 h-full w-full overflow-hidden text-justify leading-relaxed tracking-wide transition-all duration-200">
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
              className={clsx(
                "pointer-events-none mb-4 select-none tracking-wide",
                { "bg-gray-400 opacity-40 blur-[8px]": !isFocused }
              )}
            >
              {props.text.split("").map((letter, index) => {
                const state = charsState[index];
                const color =
                  state === CharStateType.Incomplete
                    ? "text-gray-500"
                    : state === CharStateType.Correct
                    ? "text-gray-200"
                    : "text-red-500";
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
              className={`caret absolute z-10 border-l-2 border-primary-color`}
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
                Accuracy: {((correctChar / props.text.length) * 100).toFixed(2)}
                %
              </span>
              <span className="mr-4 text-yellow-500">
                Duration: {duration}s
              </span>
            </>
          ) : null}
          {/*Information Text*/}
          <span className="text-white">
            <span className="mr-4"> Current Index: {currIndex}</span>
            <span className="mr-4"> Correct Characters: {correctChar}</span>
            <span className="mr-4"> Error Characters: {errorChar}</span>
          </span>
        </p>
      </div>
    </>
  );
});

export default Game;
