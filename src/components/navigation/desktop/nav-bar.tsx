import React from "react";
import { NavBarBrand } from "./nav-bar-brand";
import { NavBarButtons } from "./nav-bar-buttons";
import { NavBarTabs } from "./nav-bar-tabs";

export const NavBar: React.FC = () => {
  return (
    <div className="hidden container md:flex nav-bar__container">
      <nav className="flex flex-row flex-1 place-items-center nav-bar">
        <NavBarBrand />
        <NavBarTabs />
        <NavBarButtons />
      </nav>
    </div>
  );
};
