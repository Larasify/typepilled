import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import io from "socket.io-client";
import { useRouter } from "next/router";
import Game from "~/components/Game";
import clsx from "clsx";
import { FaAt, FaHashtag, FaClock, FaFont, FaQuoteLeft } from "react-icons/fa";
import { usePreferenceContext } from "~/context/PreferenceContext";

const Options = () => {
  const {
    preferences: { type, time, quotelength, wordlength, punctuation, numbers },
    dispatch,
  } = usePreferenceContext();

  const timeoptions = [15, 30, 60, 120];
  const wordoptions = [10, 25, 50, 100];
  const quoteoptions = ["all", "short", "medium", "long", "thicc"];

  return (
    <div className="mt-5 flex h-max w-full flex-row items-center justify-around gap-2 ">
      <div className="flex rounded-lg bg-sub-alt-color px-2 font-mono text-sm text-sub-color">
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
            className={clsx(
              "align-center duration-250 flex h-min w-full flex-row gap-1 rounded p-2 text-center leading-5 hover:text-text-color active:text-sub-color",
              { "text-primary-color": punctuation }
            )}
          >
            <FaAt className="mt-1 text-xs" /> <span> punctuation</span>{" "}
          </button>
          <button
            onClick={() => dispatch({ type: "SET_NUMBERS", payload: !numbers })}
            className={clsx(
              "align-center duration-250 flex h-min w-full flex-row gap-1 rounded p-2 text-center leading-5 hover:text-text-color active:text-sub-color",
              { "text-primary-color": numbers }
            )}
          >
            <FaHashtag className="mt-1 text-xs" /> <span> numbers</span>{" "}
          </button>
        </div>
        {/*divider*/}
        <div className="my-2 w-[0.25rem] rounded-md bg-background-color"></div>
        {/*time words quote*/}
        <div className="flex">
          <button
            onClick={() => dispatch({ type: "SET_TYPE", payload: "time" })}
            className={clsx(
              "align-center duration-250 flex h-min w-full flex-row gap-1 rounded p-2 text-center leading-5 hover:text-text-color active:text-sub-color",
              { "text-primary-color": type === "time" }
            )}
          >
            {" "}
            <FaClock className="mt-1 text-xs" /> <span> time</span>{" "}
          </button>
          <button
            onClick={() => dispatch({ type: "SET_TYPE", payload: "words" })}
            className={clsx(
              "align-center duration-250 flex h-min w-full flex-row gap-1 rounded p-2 text-center leading-5 hover:text-text-color active:text-sub-color",
              { "text-primary-color": type === "words" }
            )}
          >
            {" "}
            <FaFont className="mt-1 text-xs" /> <span> words</span>{" "}
          </button>
          <button
            onClick={() => dispatch({ type: "SET_TYPE", payload: "quote" })}
            className={clsx(
              "align-center duration-250 flex h-min w-full flex-row gap-1 rounded p-2 text-center leading-5 hover:text-text-color active:text-sub-color",
              { "text-primary-color": type === "quote" }
            )}
          >
            <FaQuoteLeft className="mt-1 text-xs" /> <span> quote</span>{" "}
          </button>
        </div>
        {/*divider*/}
        <div className="my-2 w-[0.25rem] rounded-md bg-background-color"></div>
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
                  className={clsx(
                    "align-center duration-250 flex h-min w-max animate-fade-in flex-row gap-1 rounded p-2 text-center leading-5 hover:text-text-color active:text-sub-color",
                    { "text-primary-color": time === option.toString() }
                  )}
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
                  className={clsx(
                    "align-center duration-250 flex h-min w-max animate-fade-in flex-row gap-1 rounded p-2 text-center leading-5 hover:text-text-color active:text-sub-color",
                    { "text-primary-color": wordlength === option.toString() }
                  )}
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
                  className={clsx(
                    "align-center duration-250 flex h-min w-max animate-fade-in flex-row gap-1 rounded p-2 text-center leading-5 hover:text-text-color active:text-sub-color",
                    { "text-primary-color": (quotelength === option.toString() && quotelength !== "all") || (quotelength === "all" && option !== "all") }
                  )}
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
