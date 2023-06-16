import clsx from "clsx";
import NextNProgress from "nextjs-progressbar";
import * as React from "react";
import { CgSpinner } from "react-icons/cg";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";
import { usePreferenceContext } from "~/context/Preference/PreferenceContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = React.useState(true);

  useEffect(() => {
    setTimeout(() => setIsClient(false), 500);
  }, []);

  const { preferences, dispatch } = usePreferenceContext();

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
                <div className="text-primary text-fg">
                  Preparing the page for you...
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>

          <div data-theme={preferences.theme}
            className={clsx(
              "sm:scrollbar h-screen w-full overflow-y-auto bg-base-100 transition-colors duration-300"
            )}
          >
            <div className=" mx-auto flex h-full w-11/12 max-w-6xl flex-col bg-transparent">
              <NextNProgress
                color={`#e2b714`}
                startPosition={0.3}
                stopDelayMs={200}
                height={2}
                showOnShallow={true}
              />
              <Header />

              {children}
              <Footer />
            </div>
          </div>
        </>
      )}
    </>
  );
}
