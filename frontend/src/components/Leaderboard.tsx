import { api } from "~/utils/api";

export default function Leaderboard() {
  const data = api.leaderboard.getpublicleaderboard.useQuery(undefined,{ staleTime: Infinity });
  return (
    <dialog id="leaderboard_modal" className="modal">
      <form method="dialog" className="modal-box flex max-h-96 flex-col gap-3">
        <h3 className="text-lg font-bold">Select a Theme!</h3>
        Hello my babyyy hello my honey hello my ragtime gal!
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
