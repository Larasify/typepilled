import { type NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Game from "~/components/Game";
import { FaRedo } from "react-icons/fa";

import Options from "~/components/Options";
import { getWords } from "~/utils/getWords";
import { usePreferenceContext } from "~/context/Preference/PreferenceContext";

const Home: NextPage = () => {
  const ref = useRef<HTMLInputElement>(null);
  const { preferences } = usePreferenceContext();
  const [text, setText] = useState(
    "hello my baby hello my honey hello my ragtime gal how are you i am a frog froggity frog hop hop fill this line please bro what why does it not work properly hello my baby hello my honey hello my ragtime gal how are you i am a frog froggity frog hop hop fill this line please bro what why does it not work properly"
  );

  function handleClick() {
    reset();
  }
  useEffect(() => {
    setText(getWords(preferences).join(" "));
    ref.current?.focus();
  }, [preferences]);

  function reset() {
    console.log("reset");
    setText(getWords(preferences).join(" "));
    ref.current?.focus();
  }

  return (
    <>
      <Options />
      <div className="flex flex-col items-center h-full justify-end text-center ">
        <Game
          ref={ref}
          reset={reset}
          text={text}
          time={parseInt(preferences.time)}
        />

        <div
          className="tooltip tooltip-bottom font-bold"
          data-tip="Restart Test"
        >
          <button
            className="mt-5 rounded bg-base-100 px-8 py-4 font-normal text-neutral-500 transition-colors duration-300 hover:text-secondary active:bg-secondary active:text-neutral"
            onClick={handleClick}
          >
            <FaRedo />
          </button>
        </div>

      </div>
    </>
  );
};

export default Home;
