import { forwardRef, useRef, useState } from 'react';
import useTypingGame, { CharStateType } from 'react-typing-game-hook';

    import { string } from "zod";

type ButtonProps = {
    text: string;
    time: number;
}


 const Game = forwardRef<HTMLInputElement, ButtonProps>(function Game(props,ref){
    const [duration, setDuration] = useState(() => 0);
    const [isFocused, setIsFocused] = useState(() => false);
    const letterElements = useRef<HTMLDivElement>(null);
    const [timeLeft, setTimeLeft] = useState(props.time);

    const {
        states: { chars, charsState },
        actions: { insertTyping, resetTyping, deleteTyping },
      } = useTypingGame(props.text, { skipCurrentWordOnSpace: false });

      return (
        <h1
          onKeyDown={e => {
            e.preventDefault();
            const key = e.key;
            if (key === 'Escape') {
              resetTyping();
              return;
            }
            if (key === 'Backspace') {
              deleteTyping(false);
              return;
            }
            if (key.length === 1) {
              insertTyping(key);
            }
          }}
          tabIndex={0}
        >
          {chars.split('').map((char, index) => {
            const state = charsState[index];
            const color =
              state === CharStateType.Incomplete
                ? 'black'
                : state === CharStateType.Correct
                ? 'green'
                : 'red';
            return (
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              <span key={char + index} style={{ color }}>
                {char}
              </span>
            );
          })}
        </h1>
      );
     });
        
export default Game;
