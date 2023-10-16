/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { FaCode, FaPalette } from "react-icons/fa";
import { usePreferenceContext } from "~/context/Preference/PreferenceContext";

export default function Footer() {
  const { preferences, dispatch } = usePreferenceContext();
  const theme_options = [
    "monkey",
    "synthwave",
    "dark",
    "coffee",
    "retro",
    "forest",
    "valentine",
    "halloween",
    "garden",
    "bumblebee",
    "night",
    "black",
    "catppuccin-latte",
    "catppuccin-frappe",
    "catppuccin-macchiato",
    "catppuccin-mocha",
    "catppuccin-vsc"
  ];

  return (
    <footer
      className={clsx(
        "layout flex h-4/5 items-end justify-self-end bg-transparent pb-8 font-mono"
      )}
    >
      <div className="flex w-full items-center justify-between text-neutral-500">
        <Link
          href="https://github.com/Larasify/typepilled"
          className="flex cursor-pointer items-center space-x-1.5 text-sm transition-colors duration-200 hover:text-secondary"
        >
          <FaCode />
          <div>github</div>
        </Link>

        <button
          className="flex cursor-pointer items-center space-x-1.5 text-sm transition-colors duration-200 hover:text-secondary"
          onClick={() => (window as any).my_modal_2.showModal()}
        >
          <FaPalette /> <div>themes</div>
        </button>
        <dialog id="my_modal_2" className="modal">
          <form
            method="dialog"
            className="scrollbar modal-box flex max-h-96 flex-col gap-3"
          >
            <h3 className="text-center font-roboto text-lg font-bold text-secondary">
              Select a Theme!
            </h3>
            {theme_options.map((theme) => (
              <button
                key={theme}
                className={clsx("btn mx-auto w-40 font-roboto lowercase", {
                  " btn-primary": preferences.theme === theme,
                })}
                onClick={() => dispatch({ type: "SET_THEME", payload: theme })}
              >
                {" "}
                {theme}
              </button>
            ))}
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </footer>
  );
}
