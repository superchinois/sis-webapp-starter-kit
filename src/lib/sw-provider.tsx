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
	    function (registration) {
	      console.log("Service Worker registration successful with scope: ", registration.scope);
	      setRegistration(registration);
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