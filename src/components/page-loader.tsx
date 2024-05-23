import React from "react";
import Image from "next/image";

export const PageLoader: React.FC = () => {
  const loadingImg = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";

  return (
    <div className="container mx-auto flex justify-center loader">
      <Image className="animate-spin" src={loadingImg} alt="Loading..." height={50} width={50} priority={true} />
    </div>
  );
};
