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

const Options = () => {
    const [test, setTest] = useState(false);
    return (
      <div className="mt-5 flex h-max w-full flex-row items-center justify-around gap-2 ">
        <div className="flex rounded-lg bg-sub-alt-color px-2 text-sm text-sub-color">
          {/*punc numbers*/}
          <div
            className={clsx(
              "flex overflow-hidden font-mono transition-all duration-500 ease-in-out",
              { "max-w-0 opacity-0": test },
              { "max-w-xs opacity-100": !test }
            )}
          >
            <button className="align-center duration-250 flex h-min w-full flex-row gap-1 rounded p-2 text-center leading-5 transition hover:text-text-color">
              <FaAt className="mt-1 text-xs" /> <span> punctuation</span>{" "}
            </button>
            <button
              className={clsx(
                "align-center duration-250 flex h-min w-full flex-row gap-1 rounded p-2 text-center leading-5 transition hover:text-text-color"
              )}
            >
              <FaHashtag className="mt-1 text-xs" /> <span> numbers</span>{" "}
            </button>
          </div>
          {/*divider*/}
          <div className="my-2 w-[0.25rem] rounded-md bg-background-color"></div>
          {/*time words quote*/}
          <div className="flex">
            <button className="align-center duration-250 flex h-min w-max flex-row gap-1 rounded p-2 text-center leading-5 transition hover:text-text-color">
              <FaClock className="mt-1 text-xs" /> <span> time</span>{" "}
            </button>
            <button className="align-center duration-250 flex h-min w-max flex-row gap-1 rounded p-2 text-center leading-5 text-primary-color transition hover:text-text-color">
              <FaFont className="mt-1 text-xs" /> <span> words</span>{" "}
            </button>
            <button
              onClick={() => {
                setTest(!test);
              }}
              className="align-center duration-250 flex h-min w-max flex-row gap-1 rounded p-2 text-center leading-5 transition hover:text-text-color"
            >
              <FaQuoteLeft className="mt-1 text-xs" /> <span> quote</span>{" "}
            </button>
          </div>
          {/*divider*/}
          <div className="my-2 w-[0.25rem] rounded-md bg-background-color"></div>
          {/*timer words quote-options*/}
          <div className="flex text-xs">
            <button className="align-center duration-250 flex h-min w-max flex-row gap-1 rounded p-2 text-center leading-5 transition hover:text-text-color">
              <span> 15</span>{" "}
            </button>
            <button className="align-center duration-250 flex h-min w-max flex-row gap-1 rounded p-2 text-center leading-5 transition hover:text-text-color">
              <span> 30</span>{" "}
            </button>
            <button className="align-center duration-250 flex h-min w-max flex-row gap-1 rounded p-2 text-center leading-5 transition hover:text-text-color">
              <span> 60</span>{" "}
            </button>
            <button className="align-center duration-250 flex h-min w-max flex-row gap-1 rounded p-2 text-center leading-5 transition hover:text-text-color">
              <span> 120</span>{" "}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
export default Options;
