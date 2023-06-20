import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FaAt, FaCrown, FaHashtag } from "react-icons/fa";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CgSpinner } from "react-icons/cg";

dayjs.extend(relativeTime);

/*
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
  punctuation: boolean;
  numbers: boolean;
};

function LeaderboradMap(props: { data: Data[] }) {
  console.log("hey", props.data.at(0)?.user.name);
  return <div>hey {props.data.at(0)?.user.name}</div>;
}*/

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
          className="scrollbar modal-box h-full w-screen max-w-screen-2xl overflow-x-hidden font-roboto"
        >
          <span className="font-mono text-3xl text-secondary">
            Time mode Leaderboards
          </span>
          <div className="flex h-[90%] flex-col gap-5 p-2 sm:flex-row">
            {[15, 30].map((timetype) => (
              <>
                <div className="h-full w-full ">
                  {isLoading && <CgSpinner />}
                  <div className="text-secondary">Time {timetype}</div>
                  <div className="scrollbar h-full overflow-y-scroll">
                    <table className="table-zebra table w-full">
                      <thead className="font-semibold">
                        <td className=" w-[5%]">#</td>
                        <td>name</td>
                        <td className=" w-1/6 text-right">
                          wpm <br />{" "}
                          <span className=" opacity-50">modifiers</span>{" "}
                        </td>
                        <td className=" w-1/6 text-right">
                          accuracy <br />{" "}
                          <span className=" opacity-50">raw characters</span>{" "}
                        </td>
                        <td className=" w-1/5 text-right">date</td>
                      </thead>
                      <tbody className="leading-4">
                        {data?.leaderboard.map(
                          (user, index) =>
                            user.type === timetype.toString() && (
                              <tr key={user.id}>
                                <td className="py-0">{index + 1}</td>
                                <td className="py-0">
                                  <span>{user.user.name}</span>
                                </td>
                                <td className="py-0 text-right leading-5">
                                  {user.wpm.toFixed(2)} <br />{" "}
                                  <div className="flex justify-end gap-3">
                                    <FaAt
                                      className={clsx(
                                        "mt-0 text-xs  ",
                                        {
                                          "text-primary opacity-100":
                                            user.punctuation,
                                        },
                                        { "opacity-50": !user.punctuation }
                                      )}
                                    />
                                    <FaHashtag
                                      className={clsx(
                                        "mt-0 text-xs ",
                                        {
                                          "text-primary opacity-100":
                                            user.numbers,
                                        },
                                        { "opacity-50": !user.numbers }
                                      )}
                                    />
                                  </div>
                                </td>
                                <td className="py-0 text-right">
                                  {user.accuracy.toFixed(2)}% <br />{" "}
                                  <span className="opacity-50">
                                    {user.wordcount}
                                  </span>
                                </td>
                                <td className="py-2 text-right">
                                  {dayjs(user.createdAt).format("DD MMM YYYY")}{" "}
                                  <br />
                                  <span className="opacity-50">
                                    {dayjs(user.createdAt).format("HH:mm")}
                                  </span>
                                </td>
                              </tr>
                            )
                        )}
                      </tbody>
                      <tfoot>
                        <tr></tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </>
            ))}
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
              "cursor-pointer fill-neutral-500 text-lg transition-colors duration-200 hover:fill-secondary"
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
