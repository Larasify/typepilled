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

import { usePreferenceContext } from "../../context/PreferenceContext";

const typeList = ["words", "sentences", "numbers"];

const timeList = ["15", "30", "45", "60", "120"];

export default function Header() {
  const {
    preferences: { type, time },
    dispatch,
  } = usePreferenceContext();

  const { pathname } = useRouter();

  return (
    <header className={clsx("layout font-primary bg-transparent")}>
      <div className="flex w-full flex-col items-center justify-between space-y-2 pt-6 sm:flex-row sm:space-x-6 sm:space-y-0">
        <div className="group flex w-full items-center justify-start space-x-6 sm:w-auto">
          <Link href="/">
            <div className="flex space-x-1">
              <TbKeyboard className="group-hover:text-hl text-4xl text-primary transition-colors duration-200" />

              <div className="text-fg relative font-mono text-3xl">
                <div className="group-hover:text-fg absolute -top-4 left-0 text-[8px] text-secondary transition-colors duration-200">
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
                <div className="peer">
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
            </div>
            <div className="relative">
              <div className="peer">
                <Link href="/leaderboard">
                  <FaCrown
                    className={clsx(
                      "cursor-pointer fill-neutral text-lg transition-colors duration-200 hover:fill-secondary",
                      { "fill-secondary": pathname === "/leaderboard" }
                    )}
                  />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="peer">
                <Link href="/about">
                  <FaInfo
                    className={clsx(
                      "cursor-pointer fill-neutral text-lg transition-colors duration-200 hover:fill-secondary",
                      { "fill-secondary": pathname === "/about" }
                    )}
                  />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="peer">
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
              <div className="peer"></div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
