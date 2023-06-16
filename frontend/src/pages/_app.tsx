import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import PreferenceProvider from "~/context/Preference/PreferenceContext";
import Header from "~/components/Layout/Header";
import Layout from "~/components/Layout/Layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <PreferenceProvider>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </PreferenceProvider>
  );
};

export default api.withTRPC(MyApp);
