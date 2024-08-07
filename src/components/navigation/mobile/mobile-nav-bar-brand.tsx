import React from "react";
import Link from "next/link";
import Image from "next/image";

interface MobileNavBarBrandProps {
  handleClick: () => void;
}

export const MobileNavBarBrand: React.FC<MobileNavBarBrandProps> = ({
  handleClick,
}) => {
  return (
    <div onClick={handleClick} className="flex flex-1 mobile-nav-bar__brand">
      <Link href="/">
        <Image
          className="mobile-nav-bar__logo"
          src="https://cdn.auth0.com/blog/hub/code-samples/hello-world/auth0-logo.svg"
          alt="Auth0 shield logo"
          width={24}
          height={24}
          priority={false}
        />
      </Link>
    </div>
  );
};
