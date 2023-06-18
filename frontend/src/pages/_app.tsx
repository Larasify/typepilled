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
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const description =
    "Come race your friends in this typing test inspired by monkeytype and typeracer";
  const title = "typepilled";
  const imageMetaURL = "https://typepilled.vercel.app/social.png";


  return (
    <PreferenceProvider>
      <SessionProvider
        session={session}
        refetchInterval={60 * 60 * 24}
        refetchOnWindowFocus={false}
      >
        <RoomProvider>
          <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="icon" href={"https://typepilled.vercel.app/favicon.ico"} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageMetaURL} />
            <meta name="twitter:image" content={imageMetaURL} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="theme-color" content="#000000" />

            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <meta
              name="apple-mobile-web-app-title"
              content="typepilled"
            />
            <meta
              name="application-name"
              content="typepilled"
            />
          </Head>

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
