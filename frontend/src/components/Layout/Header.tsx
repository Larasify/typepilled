import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import {
  FaCrown,
  FaInfo,
  FaKeyboard,
  FaRegUser,
  FaTerminal,
  FaUser,
} from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { TbKeyboard } from "react-icons/tb";

import { usePreferenceContext } from "../../context/Preference/PreferenceContext";
import { useSession } from "next-auth/react";

const typeList = ["words", "sentences", "numbers"];

const timeList = ["15", "30", "45", "60", "120"];

export default function Header() {
  const {
    preferences: { type, time },
    dispatch,
  } = usePreferenceContext();

  const { pathname } = useRouter();

  const { data: session, status } = useSession();
  /*if (status === "authenticated") {
    return <p>Signed in as {session.user.email}</p>
  }*/

  return (
    <header className={clsx("layout font-primary bg-transparent")}>
      <div className="flex w-full flex-col items-center justify-between space-y-2 pt-6 sm:flex-row sm:space-x-6 sm:space-y-0">
        <div className="group flex w-full items-center justify-start space-x-6 sm:w-auto">
          <Link href="/">
            <div className="flex space-x-1">
              <TbKeyboard className="group-hover:text-hl text-4xl text-primary transition-colors duration-200" />

              <div className="relative font-mono text-3xl">
                <div className="absolute -top-4 left-0 text-[8px] text-secondary transition-colors duration-200">
                  im so
                </div>
                <span className="group-hover:text-hl text-secondary transition-colors duration-200">
                  typepilled
                </span>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex w-full flex-1 items-center justify-between sm:w-auto">
          <div className="flex space-x-6">
            <div className="tooltip tooltip-bottom font-bold" data-tip="Solo">
              <div className="relative">
                <Link href="/">
                  <FaKeyboard
                    className={clsx(
                      "secondary cursor-pointer fill-neutral text-lg transition-colors duration-200 hover:fill-secondary",
                      { " fill-secondary": pathname === "/" }
                    )}
                  />
                </Link>
              </div>
            </div>

            <div className="relative">
              <Link href="/leaderboard">
                <FaCrown
                  className={clsx(
                    "cursor-pointer fill-neutral text-lg transition-colors duration-200 hover:fill-secondary",
                    { "fill-secondary": pathname === "/leaderboard" }
                  )}
                />
              </Link>
            </div>
            <div className="relative">
              <Link href="/about">
                <FaInfo
                  className={clsx(
                    "cursor-pointer fill-neutral text-lg transition-colors duration-200 hover:fill-secondary",
                    { "fill-secondary": pathname === "/about" }
                  )}
                />
              </Link>
            </div>
            <div className="relative">
              <Link href="/multiplayer">
                <RiTeamFill
                  className={clsx(
                    "cursor-pointer fill-neutral text-lg transition-colors duration-200 hover:fill-secondary",
                    { "fill-secondary": pathname === "/multiplayer" }
                  )}
                />
              </Link>
            </div>
          </div>
          <div className="relative">
            <Link href="/account">
              <div className="group mr-2 flex h-full cursor-pointer gap-2 fill-neutral text-neutral transition-colors duration-200 hover:fill-secondary hover:text-secondary">
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
                      "cursor-pointer fill-neutral text-lg transition-colors duration-200 hover:fill-secondary",
                      { "fill-secondary": pathname === "/account" }
                    )}
                  />
                )}
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
