"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React from 'react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { fetchOpeners, fetchIsSubscribed } from '@/app/actions/actions'

//import { HeroBanner } from "@/components/hero-banner";
//import { Auth0Features } from "@/components/auth0-features";
////   <>
// {/*    <HeroBanner />
//     <Auth0Features />*/}
//   </>

const FormSchema = z.object({
  marketing_emails: z.boolean().default(false).optional(),
})


const Home = () => {
  const [data, setData] = React.useState({});
  const [subscribed, setSubscribed] = React.useState({});
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    // defaultValues: {
    //   marketing_emails: true,
    // },
  })

    function onSubmit(data: z.infer<typeof FormSchema>) {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    }
    React.useEffect(()=>{
      fetchOpeners().then(response=>setData(response));
      fetchIsSubscribed("eric.lichamyon@sis.re").then(response => setSubscribed(response));
    }, [])
    return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">Notifications SIS</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="marketing_emails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Ouverture magasin
                    </FormLabel>
                    <FormDescription>
                      Recevoir les notifications d'ouverture de magasin 
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">Enregistrer</Button>
      </form>
    </Form>
  )
}

export default Home;
