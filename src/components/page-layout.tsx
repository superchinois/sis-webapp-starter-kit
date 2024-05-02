"use client";

import React, { PropsWithChildren } from "react";
import { NavBar } from "./navigation/desktop/nav-bar";
import { MobileNavBar } from "./navigation/mobile/mobile-nav-bar";
import { PageFooter } from "./page-footer";
import { PageLoader } from "@/components/page-loader";
import { useUser } from "@auth0/nextjs-auth0/client";

export const PageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="md:container md:mx-auto">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="md:container md:mx-auto w-full overflow-hidden">
      <header className="fixed top-0 w-full">
        <NavBar />
        <MobileNavBar />
      </header>
      <main className="overflow-y-scroll">
        <div className="page-layout__content">{children}</div>
      </main>
      <footer className="page-footer">
        <PageFooter />
      </footer>
    </div>
  );
};
