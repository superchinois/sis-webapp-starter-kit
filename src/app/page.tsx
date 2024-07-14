"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React from 'react'

import { Button } from "@/components/ui/button"
import { useUser } from "@auth0/nextjs-auth0/client";

import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { fetchOpeners } from '@/app/actions/actions'
import { SwContext } from '@/lib/sw-provider';
import { urlBase64ToUint8Array } from '@/lib/utils';
import { BellRing } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner";

//import { HeroBanner } from "@/components/hero-banner";
//import { Auth0Features } from "@/components/auth0-features";
////   <>
// {/*    <HeroBanner />
//     <Auth0Features />*/}
//   </>


interface OpeningData {
  date: string;
  persons: string[];
}

function showNotification(description: string) {
  toast({description})
}

const Home = () => {
  const { user } = useUser();
  const [data, setData] = React.useState([] as OpeningData[]);
  const [checked, setChecked] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const registration = React.useContext(SwContext);

  const subscribe= async ()=>{
    const result = await window.Notification.requestPermission();
    if (result === "granted") {
      const subscription = await registration?.pushManager.subscribe({
        applicationServerKey: urlBase64ToUint8Array(
          "BNYYAA9R_CC-0q7RJroloSbjP35nZScmi3oXMalAsSgiEDDuLLaZ-Kno2DQq6zMZ8UOfhyLFDq9iuxYd83Sebf0"
        ),
        userVisibleOnly: true,
      });
      showNotification("Subscription en cours...");
      if (subscribed == false) {
        const response = await fetch("/api/subscriptions", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({subscription, topicId: 'notifications'}),
        });
        if (response.status != 200 ) {
          showNotification("Probleme de subscription");
          setChecked(false);
        } else {
          showNotification("Subscription réussie");
          setSubscribed(true);
        }
      }
    };

  };
  const unsubscribe= async ()=>{
    showNotification("Désinscription en cours...")
    if (subscribed == true) {
      const response = await fetch("/api/subscriptions", {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({topicId: 'notifications'}),
      });
      if (response.status != 200 ) {
        showNotification("Probleme de désinscription");
        setChecked(true);
      } else {
        showNotification("Désinscription réussie");
        const subscription = await registration?.pushManager.getSubscription();
        await subscription?.unsubscribe();
        setSubscribed(false);
      }
    }
  };
  const toggleSubscription = async (toggleValue:boolean) => {
    setChecked(toggleValue);
    if (toggleValue == true ) {
      subscribe();
    } else {
      unsubscribe();
    }
  };

  React.useEffect(()=>{
      if(user) {
        fetchOpeners().then(response=>{setData(response);setIsLoading(false);}).catch(error => console.log(error));
        fetch("/api/subscriptions",{
          method: "get",
          headers: {
            "Content-Type": "application/json",
          }
        }).then(response =>{
              if (response.status == 200) {
                response.json().then(({data}) => setSubscribed(data.is_subscribed))
              }
          });
      }
    }, [user])
    return (
    <>
    <Card className="w-[380px] container mx-auto">
      <CardHeader>
        <CardTitle>Ouverture magasin</CardTitle>
        
      </CardHeader>
      { !user && (
        <>
          <CardDescription>Connectez vous pour acceder aux ouvertures</CardDescription>
        </>
        )
      }
      { user && (
        <>
          <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Recevoir les notifications d'ouverture de magasin.
            </p>
          </div>
          <Switch checked={subscribed} onCheckedChange={(checked) => toggleSubscription(checked)}/>
        </div>
        {isLoading ?
          <Spinner />
          :(<div>
          {data.map((opening: OpeningData) => (
            <div
              key={opening.date}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {opening.date}
                </p>
                <p className="text-sm text-muted-foreground">
                  {opening.persons.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
            )
        }
      </CardContent>
        </>
        )}
    </Card>
    </>
  )
}

export default Home;
