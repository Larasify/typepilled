import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaAt, FaCrown, FaHashtag, FaMedal } from "react-icons/fa";
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
  const {
    data: page2data,
    isLoading: page2isLoading,
    refetch: page2Refetch,
  } = api.leaderboard.getpublicleaderboardpg2.useQuery(undefined, {
    staleTime: Infinity,
    enabled: false,
  });

  const [pagenumber, setPagenumber] = useState(1);
  const modalRef = useRef<HTMLDialogElement>(null);

  const shownData = useMemo(() => {
    return pagenumber === 1
      ? [data?.leaderboard15, data?.leaderboard30]
      : [page2data?.leaderboard60, page2data?.leaderboard120];
  }, [pagenumber, data, page2data]);
  const shownLoading = useMemo(() => {
    return pagenumber === 1 ? isLoading : page2isLoading;
  }, [pagenumber, isLoading, page2isLoading]);

  return (
    <>
      <dialog id="leaderboard_modal" className="modal" ref={modalRef}>
        <form
          method="dialog"
          className="scrollbar modal-box h-full w-screen max-w-screen-2xl overflow-x-hidden font-roboto"
        >
          <div className="flex w-full justify-between">
            <span className="font-mono  sm:text-3xl text-secondary">
              Time mode Leaderboards
            </span>
            <div className="flex items-center gap-2">
              <div
                className={clsx("btn h-8 min-h-max rounded-md px-12", {
                  "btn-primary": pagenumber === 1,
                })}
                onClick={() => setPagenumber(1)}
              >
                1
              </div>
              <div
                className={clsx("btn h-8 min-h-max rounded-md px-12", {
                  "btn-primary": pagenumber === 2,
                })}
                onClick={() => {
                  setPagenumber(2);
                  if (!page2data) void page2Refetch();
                }}
              >
                2
              </div>
            </div>
          </div>
          <div className="flex h-[90%] flex-col gap-5 p-2 lg:flex-row">
            {shownData.map((leaderboard, index) => (
              <div key={index} className="h-full w-full ">
                <div className="text-secondary font-bold">
                  Time {leaderboard?.at(0)?.type}{" "}
                  {shownLoading && <span className="loading loading-spinner w-4 h-4" />}
                </div>
                <div className="scrollbar h-full overflow-y-scroll overflow-x-hidden">
                  <table className="table-zebra table w-full">
                    <thead className="sticky top-0 z-50 bg-base-100 font-semibold">
                      <tr>
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
                      </tr>
                    </thead>
                    <tbody className="leading-4">
                      {leaderboard &&
                        leaderboard.map((user, index) => (
                          <tr key={user.id}>
                            <td className="py-0">
                              {index + 1 === 1 ? (
                                <FaCrown className="text-primary" />
                              ) : index + 1 === 2 || index + 1 === 3 ? (
                                <FaMedal
                                  className={clsx(
                                    "",
                                    { "text-zinc-400": index + 1 === 2 },
                                    { "text-orange-400": index + 1 === 3 }
                                  )}
                                />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </td>
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
                                      "text-primary opacity-100": user.numbers,
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
                            <td className="py-2 text-right whitespace-nowrap">
                              {dayjs(user.createdAt).format("DD MMM YYYY")}{" "}
                              <br />
                              <span className="opacity-50">
                                {dayjs(user.createdAt).format("HH:mm")}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <tfoot>
                      <tr></tr>
                    </tfoot>
                  </table>
                </div>
              </div>
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
