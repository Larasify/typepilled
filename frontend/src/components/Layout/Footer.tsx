/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import clsx from 'clsx';
import Link from 'next/link';
import * as React from 'react';
import { FaCode } from 'react-icons/fa';
import { usePreferenceContext } from '~/context/PreferenceContext';


export default function Footer() {
  const { preferences, dispatch } = usePreferenceContext();

  return (
    <footer
      className={clsx(
        'layout flex h-full justify-self-end bg-transparent pt-12 pb-8'
      )}
    >
      <div className='flex w-full items-center justify-between text-neutral'>
        <Link
          href='https://github.com/larasify'
          className='flex cursor-pointer items-center space-x-1.5 text-sm transition-colors duration-200 hover:text-secondary'
        >
          <FaCode />
          <div>github</div>
        </Link>

        
        <button className='transition-colors duration-200 hover:text-secondary text-sm font-mono'  onClick={()=>(window as any).my_modal_2.showModal()}>Themes</button>
        <dialog id="my_modal_2" className="modal">
          <form method="dialog" className="modal-box max-h-96 flex flex-col gap-3">
            <h3 className="font-bold text-lg">Select a Theme!</h3>
            <button onClick={() => dispatch({ type: "SET_THEME", payload: "monkey" })}> Monkey</button>
            <button onClick={() => dispatch({ type: "SET_THEME", payload: "dark" })}> Dark</button>
            <button onClick={() => dispatch({ type: "SET_THEME", payload: "synthwave" })}> Syn</button>
            <button onClick={() => dispatch({ type: "SET_THEME", payload: "bumblebee" })}> Bumb</button>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

      </div>
    </footer>
  );
}
