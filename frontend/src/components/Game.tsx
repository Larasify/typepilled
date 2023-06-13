import clsx from "clsx";
import { forwardRef, useEffect, useRef, useState, useMemo } from "react";
import useTypingGame, { CharStateType } from "react-typing-game-hook";
import { BsCursorFill } from "react-icons/bs";
import { BsFlagFill } from "react-icons/bs";
import { string } from "zod";

type ButtonProps = {
  text: string;
  time: number;
  reset: () => void;
};

export type GameElement = {
  resetTyping: () => void;
}

const Game = forwardRef<GameElement, ButtonProps>(function Game(
  props,
  ref
) {
  const [duration, setDuration] = useState(() => 0);
  const [isFocused, setIsFocused] = useState(() => false);
  const letterElements = useRef<HTMLDivElement>(null);

  //get game hook
  const {
    states: {
      charsState,
      currIndex,
      phase,
      correctChar,
      errorChar,
      startTime,
      endTime,
    },
    actions: { insertTyping, resetTyping, deleteTyping, endTyping },
  } = useTypingGame(props.text, { skipCurrentWordOnSpace: false });

  // set cursor
  const pos = useMemo(() => {
    if (currIndex !== -1 && letterElements.current) {
      const spanref: any = letterElements.current.children[currIndex];
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unsafe-member-access
      const left = spanref.offsetLeft + spanref.offsetWidth - 2;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const top = spanref.offsetTop - 2;
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
  useEffect(() => {
    console.log(props.text);
    endTyping();
    resetTyping();
  }, [props.text]);

  return (
    <div>
      <div
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e.key, e.ctrlKey)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`relative font-serif text-xl outline-none`}
      >
        <div
          ref={letterElements}
          className="pointer-events-none mb-4 select-none tracking-wide"
          tabIndex={0}
        >
          {props.text.split("").map((letter, index) => {
            const state = charsState[index];
            const color =
              state === CharStateType.Incomplete
                ? "text-gray-700"
                : state === CharStateType.Correct
                ? "text-gray-400"
                : "text-red-500";
            return (
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              <span key={letter + index} className={`${color}`}>
                {letter}
              </span>
            );
          })}
        </div>
        {phase !== 2 && isFocused ? (
          <span
            style={{
              left: pos.left,
              top: pos.top,
            }}
            className={`caret border-l-2 border-orange-500 absolute z-10`}
          >
            &nbsp;
          </span>
        ) : null}
      </div>
      <p className="text-sm">
        {phase === 2 && startTime && endTime ? (
          <>
            <span className="mr-4 text-green-500">
              WPM: {Math.round(((60 / duration) * correctChar) / 5)}
            </span>
            <span className="mr-4 text-blue-500">
              Accuracy: {((correctChar / props.text.length) * 100).toFixed(2)}%
            </span>
            <span className="mr-4 text-yellow-500">Duration: {duration}s</span>
          </>
        ) : null}
        <span className="mr-4"> Current Index: {currIndex}</span>
        <span className="mr-4"> Correct Characters: {correctChar}</span>
        <span className="mr-4"> Error Characters: {errorChar}</span>
      </p>
    </div>
  );
});

export default Game;
