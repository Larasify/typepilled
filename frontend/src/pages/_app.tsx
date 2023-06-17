import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import PreferenceProvider from "~/context/Preference/PreferenceContext";
import Header from "~/components/Layout/Header";
import Layout from "~/components/Layout/Layout";
import { RoomProvider } from "~/context/Room/RoomContext";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <PreferenceProvider>
      <SessionProvider session={session}>
        <RoomProvider>
          <Layout>
            <Toaster position="bottom-center" />
            <Component {...pageProps} />
          </Layout>
        </RoomProvider>
      </SessionProvider>
    </PreferenceProvider>
  );
};

export default api.withTRPC(MyApp);
