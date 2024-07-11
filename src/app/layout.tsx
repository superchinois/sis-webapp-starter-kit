//import "../styles/styles.css";
import '../styles/globals.css';
import React, { PropsWithChildren } from "react";
import { PageLayout } from "@/components/page-layout";
import { siteMetadata } from "@/components/page-head";
import { PreloadResources } from "@/app/preload-resources";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import SwProvider from '@/lib/sw-provider';
import ReactHookFormProvider from '@/lib/form-provider';
import { Toaster } from "@/components/ui/toaster"

export const metadata = siteMetadata;

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <PreloadResources />
      <body>
        <UserProvider>
        <SwProvider>
        <ReactHookFormProvider>
          <PageLayout>{children}</PageLayout>
        </ReactHookFormProvider>
        </SwProvider>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
