/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useRouter } from "next/router";
import * as React from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function RoomCode() {
  const router = useRouter();

  return (
    <span
      onClick={() => {
        if (router.query?.id) {
          void navigator.clipboard
            .writeText(router?.query?.id as string)
            .then(() => {
              toast.success("Copied to clipboard", {
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
              });
            });
        }
      }}
      className="btn text-white relative flex cursor-pointer items-center rounded-md bg-primary px-4 pt-5 text-3xl font-bold w-max h-max mt-5 mb-5"
    >
      <span className="absolute left-0 top-0 whitespace-nowrap px-4 pt-1 text-xs">
        copy and share
      </span>
      {router.query?.id}
      <FaCopy className="ml-2 text-2xl" />
    </span>
  );
}
