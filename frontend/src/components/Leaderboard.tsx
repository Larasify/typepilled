import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FaCrown } from "react-icons/fa";
import { api } from "~/utils/api";

type User = {
  name: string;
  email: string;
  image: string;
  id: string;
};
type Data = {
  user: User;
  id: string;
  createdAt: Date;
  userId: string;
  type: string;
  wpm: number;
  accuracy: number;
  wordcount: number;
};

function LeaderboradMap(props: { data: Data[] }) {
  console.log("hey", props.data.at(0)?.user.name);
  return <div>hey {props.data.at(0)?.user.name}</div>;
}

export default function Leaderboard() {
  const { data, isLoading, refetch } =
    api.leaderboard.getpublicleaderboard.useQuery(undefined, {
      staleTime: Infinity,
      enabled: false,
    });
  const { pathname } = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <dialog id="leaderboard_modal" className="modal" ref={modalRef}>
        <form
          method="dialog"
          className="modal-box h-full w-screen overflow-auto max-w-screen-2xl"
        >
          <h3 className="text-lg font-bold">Select a ThemeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!</h3>
          {!isLoading ? (
            <LeaderboradMap data={data?.leaderboard as Data[]} />
          ) : (
            "Hello my babyyy hello my honey hello my ragtime gal!"
          )}
          <div className="flex flex-row h-full">
          <div className="overflow-y-scroll w-full h-full scrollbar">
            <table className="w-full table table-zebra">
              <thead>
                <td className=" w-[5%]">#</td>
                <td>name</td>
                <td className=" w-1/6 text-right">wpm</td>
                <td className=" w-1/6 text-right">accuracy</td>
                <td className=" w-1/5 text-right">raw</td>
              </thead>
              <tbody>
                {data?.leaderboard.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>
                        <span>{user.user.name}</span>
                    </td>
                    <td className="text-right">{user.wpm}</td>
                    <td className="text-right">{user.accuracy}%</td>
                    <td className="text-right">{user.wordcount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr></tr>
              </tfoot>
            </table>
          </div>
          <div className="overflow-y-scroll w-full h-full scrollbar">
            <table className="w-full table table-zebra">
              <thead>
                <td className=" w-[5%]">#</td>
                <td>name</td>
                <td className=" w-1/6 text-right">wpm</td>
                <td className=" w-1/6 text-right">accuracy</td>
                <td className=" w-1/5 text-right">raw</td>
              </thead>
              <tbody>
                {data?.leaderboard.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>
                        <span>{user.user.name}</span>
                    </td>
                    <td className="text-right">{user.wpm}</td>
                    <td className="text-right">{user.accuracy}%</td>
                    <td className="text-right">{user.wordcount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr></tr>
              </tfoot>
            </table>
          </div>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button className=" cursor-default outline-none">close</button>
        </form>
      </dialog>
      <div className="tooltip tooltip-bottom font-bold" data-tip="Leaderboard">
        <div className="relative">
          <FaCrown
            className={clsx(
              "cursor-pointer fill-neutral text-lg transition-colors duration-200 hover:fill-secondary",
              { "fill-secondary": pathname === "/leaderboard" }
            )}
            onClick={() => {
              modalRef.current?.showModal();
              if (!data) void refetch();
            }}
          />
        </div>
      </div>
    </>
  );
}
