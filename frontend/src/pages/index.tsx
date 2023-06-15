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
import Options from "~/components/Options";

const Home: NextPage = () => {
  useEffect(() => {
    console.log("initialising socket");
    const socket = io("http://localhost:8080");

    socket.on("connect", () => {
      console.log("connected to socket");
      socket.emit("message", "hello world");
      socket.on("message", (data) => {
        console.log(data);
      });
    });
  }, []);

  const ref = useRef<HTMLInputElement>(null);

  function handleClick() {
    reset();
  }
  const [text, setText] = useState(
    "hello my baby hello my honey hello my ragtime gal how are you i am a frog froggity frog hop hop fill this line please bro what why does it not work properly hello my baby hello my honey hello my ragtime gal how are you i am a frog froggity frog hop hop fill this line please bro what why does it not work properly"
  );
  function reset() {
    console.log("reset");
    setText(
      "brr im so good at typing lets gooo poggers is this thing on wohooo"
    );
    console.log(text);
    ref.current?.focus();
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthShowcase />
      <Options />
      <div className="layout flex flex-col items-center pt-36 text-center ">
        <h1 className="h-40 text-4xl font-bold text-primary-color">
          Welcome to Typepilled
        </h1>
        <Game ref={ref} reset={reset} text={text} time={99} />

        <div
          className="tooltip tooltip-bottom font-bold"
          data-tip="Restart Test"
        >
          <button
            className="mt-5 rounded-lg border bg-gray-400 p-1 font-normal"
            onClick={handleClick}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-gray-400 px-10 py-3 font-semibold text-white no-underline transition hover:bg-gray-600"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

