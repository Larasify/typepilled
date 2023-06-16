
import { signIn, signOut, useSession } from "next-auth/react";
import { FaSignInAlt } from "react-icons/fa";


import { api } from "~/utils/api";


export default function Account() {
  return <AuthShowcase />;
}

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex h-full w-full mx-auto flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="flex items-center gap-2 rounded-lg bg-accent px-20 py-3 font-semibold text-secondary hover:text-neutral no-underline transition hover:bg-secondary"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        <FaSignInAlt/>{sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
