'use client'
import React, { PropsWithChildren } from "react";

export const SwContext = React.createContext<ServiceWorkerRegistration|null>(null);

const SwProvider : React.FC<PropsWithChildren> = ({ children }) =>
{
	const [registration, setRegistration] = React.useState<ServiceWorkerRegistration|null>(null);
	React.useEffect(() => {
	if("serviceWorker" in navigator) {
	  navigator.serviceWorker.register(
	    "serviceworker.js",
	    {
	      scope: "./",
	    }
	  ).then(
	    function (swRegistration) {
	      console.log("Service Worker registration successful with scope: ", swRegistration.scope);
	      setRegistration(swRegistration);
	    },
	    function (err) {
	      console.log("Service Worker registration failed: ", err);
	    }
	  );;
	}
	}, [])
	return <SwContext.Provider value={registration}>{children}</SwContext.Provider>
};

export default SwProvider;