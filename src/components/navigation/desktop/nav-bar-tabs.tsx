import React from "react";
import { NavBarTab } from "./nav-bar-tab";
import { useUser } from "@auth0/nextjs-auth0/client";
import { NavigationMenuDemo } from "@/components/navigationmenudemo";
export const NavBarTabs: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="flex flex-row gap-3 flex-1 nav-bar__tabs">
      < NavigationMenuDemo />
{/*      <NavBarTab path="/profile" label="Profile" />
      <NavBarTab path="/public" label="Public" />
       <NavBarTab path="/tables" label="Tables" />
      {user && (
        <>
          <NavBarTab path="/protected" label="Protected" />
          <NavBarTab path="/admin" label="Admin" />
        </>
      )}*/}

    </div>
  );
};
