import clsx from "clsx";
import NextNProgress from "nextjs-progressbar";
import * as React from "react";
import { CgSpinner } from "react-icons/cg";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";
import { usePreferenceContext } from "~/context/Preference/PreferenceContext";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = React.useState(true);

  useEffect(() => {
    setTimeout(() => setIsClient(false), 500);
  }, []);

  const { preferences, dispatch } = usePreferenceContext();

  const handleResize = () => {
    if (window.innerWidth < 768)
      dispatch({ type: "SET_NAV_TYPE", payload: true });
  };
  React.useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  return (
    <>
      {isClient ? (
        <>
          <div
            data-theme={preferences.theme}
            className={clsx(
              "fixed inset-0 flex h-screen w-screen items-center justify-center bg-base-100"
            )}
          >
            <div className="flex max-w-[500px] flex-wrap items-center justify-center gap-x-8 ">
              <div className="flex flex-col items-center gap-4">
                <CgSpinner className="text-fg animate-spin text-[3rem] text-primary" />
                <div className="text-fg text-neutral-400">
                  Preparing the page for you...
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            data-theme={preferences.theme}
            className={clsx(
              "scrollbar  h-screen w-full overflow-y-auto bg-base-100 transition-colors duration-300",
              { "grid grid-cols-12": !preferences.navType }
            )}
          >
            {!preferences.navType && <Navbar />}
            <div className=" h-my-screen col-span-10 mx-auto flex w-11/12 max-w-6xl flex-col bg-transparent">
              <NextNProgress
                color="#e2b714"
                startPosition={0.3}
                stopDelayMs={200}
                height={2}
                showOnShallow={true}
              />
              {preferences.navType ? <Header /> : <div className=" h-32"></div>}

              {children}
              <Footer />
            </div>
          </div>
        </>
      )}
    </>
  );
}
