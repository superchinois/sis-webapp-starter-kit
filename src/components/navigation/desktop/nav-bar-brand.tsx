import React from "react";
import Link from "next/link";
import Image from "next/image";

export const NavBarBrand: React.FC = () => {
  return (
    <div className="items-center nav-bar__brand">
      <Link href="/">
        <Image
          className="nav-bar__logo"
          src="https://cdn.auth0.com/blog/hub/code-samples/hello-world/auth0-logo.svg"
          alt="Auth0 shield logo"
          width={36}
          height={36}
          priority={false}
        />
      </Link>
    </div>
  );
};
