import Link from "next/link";
import * as React from "react";

export default function NotFoundPage() {
  return (
    <>
      <main>
        <section>
          <div className="layout flex min-h-[80vh] flex-col items-center justify-center text-center">
            <h1 className="text-2xl">
              404 This page could not be found.
            </h1>
            <Link className="text-font mt-4 md:text-lg mb-64" href="/">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
