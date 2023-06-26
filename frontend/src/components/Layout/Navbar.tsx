import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import {
  FaInfo,
  FaKeyboard,
  FaRegUser,
  FaSignInAlt,
  FaUser,
} from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { TbKeyboard } from "react-icons/tb";

import { signOut, useSession } from "next-auth/react";
import Leaderboard from "../Leaderboard";

export default function Navbar() {
  const { pathname } = useRouter();

  const { data: session } = useSession();
  /*if (status === "authenticated") {
    return <p>Signed in as {session.user.email}</p>
  }*/

  return (
    <div className="col-span-1 flex w-0 flex-col items-end justify-between gap-5 md:w-full">
      <div className="flex flex-col items-end gap-24 pt-6">
        <div className="group flex w-full items-center justify-start space-x-6 sm:w-auto">
          <Link href="/">
            <div className="flex space-x-1">
              <TbKeyboard className=" text-7xl text-primary transition-colors duration-200 2xl:text-2xl" />

              <div className="relative hidden font-mono text-2xl 2xl:block">
                <div className="absolute -top-4 left-0 text-[8px] text-secondary transition-colors duration-200">
                  im so
                </div>
                <span className="font-semibold text-secondary transition-colors duration-200">
                  typepilled
                </span>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-6">
          <div className="tooltip tooltip-bottom font-bold" data-tip="Solo">
            <div className="relative">
              <Link
                href="/"
                className="group flex flex-row items-center justify-end gap-4 align-middle 2xl:justify-start"
              >
                <FaKeyboard
                  className={clsx(
                    " cursor-pointer text-3xl transition-colors duration-200 group-hover:fill-secondary 2xl:text-lg ",
                    { "fill-secondary": pathname === "/" },
                    { "fill-neutral-500": pathname !== "/" }
                  )}
                />
                <span
                  className={clsx(
                    "hidden cursor-pointer text-lg transition-colors duration-200 group-hover:text-secondary 2xl:block",
                    { "text-secondary": pathname === "/" },
                    { "text-neutral-500": pathname !== "/" }
                  )}
                >
                  Solo
                </span>
              </Link>
            </div>
          </div>
          <Leaderboard />
          <div className="tooltip tooltip-bottom font-bold" data-tip="About">
            <div className="relative">
              <Link
                href="/about"
                className="group flex flex-row items-center justify-end gap-4 align-middle 2xl:justify-start"
              >
                <FaInfo
                  className={clsx(
                    " cursor-pointer text-3xl transition-colors duration-200 group-hover:fill-secondary 2xl:text-lg ",
                    { "fill-secondary": pathname === "/about" },
                    { "fill-neutral-500": pathname !== "/about" }
                  )}
                />
                <span
                  className={clsx(
                    "hidden cursor-pointer text-lg transition-colors duration-200 group-hover:text-secondary 2xl:block",
                    { "text-secondary": pathname === "/about" },
                    { "text-neutral-500": pathname !== "/about" }
                  )}
                >
                  About
                </span>
              </Link>
            </div>
          </div>
          <div
            className="tooltip tooltip-bottom font-bold"
            data-tip="Multiplayer"
          >
            <div className="relative">
              <Link
                href="/multiplayer"
                className="group flex flex-row items-center justify-end gap-4 align-middle 2xl:justify-start"
              >
                <RiTeamFill
                  className={clsx(
                    "cursor-pointer text-3xl transition-colors duration-200 group-hover:fill-secondary 2xl:text-lg",
                    { "fill-secondary": pathname.includes("/multiplayer") },
                    { "fill-neutral-500": !pathname.includes("/multiplayer") }
                  )}
                />
                <span
                  className={clsx(
                    "hidden cursor-pointer text-lg transition-colors duration-200 group-hover:text-secondary 2xl:block",
                    { "text-secondary": pathname.includes("/multiplayer") },
                    { "text-neutral-500": !pathname.includes("/multiplayer") }
                  )}
                >
                  Multiplayer
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center pb-8">
        <div className="tooltip tooltip-bottom font-bold" data-tip="Account">
          <div className="relative">
            <Link href="/account">
              <div className="group mr-2 flex h-full cursor-pointer gap-2 fill-neutral-500 text-neutral-500 transition-colors duration-200 hover:fill-secondary hover:text-secondary">
                {session ? (
                  <>
                    <FaUser
                      className={clsx(
                        "cursor-pointer  text-lg transition-colors duration-200",
                        { "fill-secondary": pathname === "/account" }
                      )}
                    />

                    <span
                      className={clsx(
                        "cursor-pointers font-mono  transition-colors duration-200",
                        { "text-secondary": pathname === "/account" }
                      )}
                    >
                      {session.user.name}
                    </span>
                  </>
                ) : (
                  <FaRegUser
                    className={clsx(
                      "cursor-pointer fill-neutral-500 text-lg transition-colors duration-200 hover:fill-secondary",
                      { "fill-secondary": pathname === "/account" }
                    )}
                  />
                )}
              </div>
            </Link>
          </div>
        </div>

        {session && (
          <div className="tooltip tooltip-bottom font-bold" data-tip="Sign Out">
            <FaSignInAlt
              onClick={() => void signOut()}
              className={clsx(
                "cursor-pointer fill-neutral-500 text-lg transition-colors duration-200 hover:fill-secondary",
                { "fill-secondary": pathname === "/account" }
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
