import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import PreferenceProvider from "~/context/PreferenceContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <PreferenceProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </PreferenceProvider>
  );
};

export default api.withTRPC(MyApp);
