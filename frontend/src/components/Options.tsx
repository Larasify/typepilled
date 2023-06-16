import clsx from "clsx";
import { FaAt, FaHashtag, FaClock, FaFont, FaQuoteLeft } from "react-icons/fa";
import { usePreferenceContext } from "~/context/Preference/PreferenceContext";

const Options = () => {
  const {
    preferences: { type, time, quotelength, wordlength, punctuation, numbers },
    dispatch,
  } = usePreferenceContext();

  const timeoptions = [15, 30, 60, 120];
  const wordoptions = [10, 25, 50, 100];
  const quoteoptions = ["all", "short", "medium", "long", "thicc"];

  const btnstyle =
    "align-center duration-250 flex h-min w-full flex-row gap-1 rounded p-2 text-center leading-5 hover:text-secondary active:text-neutral";

  return (
    <div className="mt-5 flex h-max w-full flex-row items-center justify-around gap-2 ">
      <div className="flex rounded-lg bg-accent px-2 font-mono text-sm text-neutral">
        {/*punc numbers*/}
        <div
          className={clsx(
            "flex overflow-hidden transition-all duration-500 ease-in-out",
            { "max-w-0 opacity-0": type === "quote" },
            { "max-w-xs opacity-100": type !== "quote" }
          )}
        >
          <button
            onClick={() =>
              dispatch({ type: "SET_PUNCTUATION", payload: !punctuation })
            }
            className={clsx(btnstyle, { "text-primary": punctuation })}
          >
            <FaAt className="mt-1 text-xs" /> <span> punctuation</span>{" "}
          </button>
          <button
            onClick={() => dispatch({ type: "SET_NUMBERS", payload: !numbers })}
            className={clsx(btnstyle, { "text-primary": numbers })}
          >
            <FaHashtag className="mt-1 text-xs" /> <span> numbers</span>{" "}
          </button>
        </div>
        {/*divider*/}
        <div className="my-2 w-[0.25rem] rounded-md bg-base-100"></div>
        {/*time words quote*/}
        <div className="flex">
          <button
            onClick={() => dispatch({ type: "SET_TYPE", payload: "time" })}
            className={clsx(btnstyle, {
              "text-primary": type === "time",
            })}
          >
            {" "}
            <FaClock className="mt-1 text-xs" /> <span> time</span>{" "}
          </button>
          <button
            onClick={() => dispatch({ type: "SET_TYPE", payload: "words" })}
            className={clsx(btnstyle, {
              "text-primary": type === "words",
            })}
          >
            {" "}
            <FaFont className="mt-1 text-xs" /> <span> words</span>{" "}
          </button>
          <button
            onClick={() => dispatch({ type: "SET_TYPE", payload: "quote" })}
            className={clsx(btnstyle, {
              "text-primary": type === "quote",
            })}
          >
            <FaQuoteLeft className="mt-1 text-xs" /> <span> quote</span>{" "}
          </button>
        </div>
        {/*divider*/}
        <div className="my-2 w-[0.25rem] rounded-md bg-base-100"></div>
        {/*timer words quote-options*/}
        <div className="flex text-xs transition-all duration-500 ease-in-out">
          {type === "time" &&
            timeoptions.map((option) => {
              return (
                <button
                  key={option}
                  onClick={() =>
                    dispatch({ type: "SET_TIME", payload: option.toString() })
                  }
                  className={clsx(btnstyle,"animate-fade-in", {
                    "text-primary": time === option.toString(),
                  })}
                >
                  <span> {option}</span>{" "}
                </button>
              );
            })}

          {type === "words" &&
            wordoptions.map((option) => {
              return (
                <button
                  key={option}
                  onClick={() =>
                    dispatch({
                      type: "SET_WORDLENGTH",
                      payload: option.toString(),
                    })
                  }
                  className={clsx(btnstyle,"animate-fade-in", {
                    "text-primary": wordlength === option.toString(),
                  })}
                >
                  <span> {option}</span>{" "}
                </button>
              );
            })}
          {type === "quote" &&
            quoteoptions.map((option) => {
              return (
                <button
                  key={option}
                  onClick={() =>
                    dispatch({
                      type: "SET_QUOTELENGTH",
                      payload: option.toString(),
                    })
                  }
                  className={clsx(btnstyle,"animate-fade-in", {
                    "text-primary":
                      (quotelength === option.toString() &&
                        quotelength !== "all") ||
                      (quotelength === "all" && option !== "all"),
                  })}
                >
                  <span> {option}</span>{" "}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Options;
