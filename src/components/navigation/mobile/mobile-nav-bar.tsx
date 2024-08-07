"use client";

import React, { Suspense } from "react";
import { MobileMenuToggleButton } from "./mobile-menu-toggle-button";
import { MobileNavBarBrand } from "./mobile-nav-bar-brand";
import { MobileNavBarButtons } from "./mobile-nav-bar-buttons";
import { MobileNavBarTabs } from "./mobile-nav-bar-tabs";
import { NavigationEvents } from "@/components/navigation/navigation-events";

enum MobileMenuState {
  CLOSED = "closed",
  OPEN = "open",
}

enum MobileMenuIcon {
  CLOSE = "close",
  MENU = "menu",
}

export const MobileNavBar: React.FC = () => {
  const [mobileMenuState, setMobileMenuState] = React.useState<MobileMenuState>(
    MobileMenuState.CLOSED,
  );
  const [mobileMenuIcon, setMobileMenuIcon] = React.useState<MobileMenuIcon>(
    MobileMenuIcon.MENU,
  );

  const isMobileMenuOpen = () => {
    return mobileMenuState === MobileMenuState.OPEN;
  };

  const closeMobileMenu = () => {
    document.body.classList.remove("mobile-scroll-lock");
    setMobileMenuState(MobileMenuState.CLOSED);
    setMobileMenuIcon(MobileMenuIcon.MENU);
  };

  const openMobileMenu = () => {
    document.body.classList.add("mobile-scroll-lock");
    setMobileMenuState(MobileMenuState.OPEN);
    setMobileMenuIcon(MobileMenuIcon.CLOSE);
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen()) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  return (
    <div className="container md:hidden mobile-nav-bar__container">
      <nav className="mobile-nav-bar">
        <MobileNavBarBrand handleClick={closeMobileMenu} />
        <MobileMenuToggleButton
          icon={mobileMenuIcon}
          handleClick={toggleMobileMenu}
        />

        {isMobileMenuOpen() && (
          <div className="bg-slate-50 mobile-nav-bar__menu">
            <MobileNavBarTabs />
            <MobileNavBarButtons />
          </div>
        )}
      </nav>
      <Suspense fallback={null}>
        <NavigationEvents closeMobileMenu={closeMobileMenu} />
      </Suspense>
    </div>
  );
};
