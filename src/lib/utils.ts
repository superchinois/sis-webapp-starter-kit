import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function urlBase64ToUint8Array(base64String:String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function zip(arr1: string[], arr2: string[]) : Array<string[]> {
  return arr1.reduce((accumulator, curr, index) => {
    return [...accumulator, [curr, arr2[index]]];
  }, [] as Array<string[]>);
}

export function toObject(zipped_values: Array<string[]>):Record<string, any> {
  return zipped_values.reduce((acc, z)=> Object.assign(acc, {[z[0]]:z[1]}), new Object() as Record<string, string>)
}

export async function getAccessToken() {
  const values = [
    "AUTH0_TOKEN_ENDPOINT",
    "AUTH0_API_CLIENT_ID",
    "AUTH0_API_CLIENT_SECRET",
    "AUTH0_CLIENT_AUDIENCE"]
  const fields = ['url', 'client_id', 'client_secret', 'audience']
  const auth0 = toObject(zip(fields, values.map(f => process.env[f]||'')))
  const {url:auth0_url, ...payload} = auth0
  const token_query_payload = JSON.stringify({...payload, grant_type:"client_credentials"})
  const res = await fetch(auth0_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: token_query_payload,
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch token')
  }

  const data = await res.json()

  return data
}

interface FetchOptions {
  url: string;
  method: string;
  withAccessToken?: boolean;
}

export async function build_fetch(options: FetchOptions):Promise<(body?: Record<string, any>)=>ReturnType<typeof fetch>>{
  const {url, method, withAccessToken} = options;
  const headers: Record<string, any> = {};
  headers["Content-Type"]="application/json";
  if( withAccessToken ) {
    const {token_type, access_token} = await getAccessToken();
    headers["Authorization"]=`${token_type} ${access_token}`;
  }
  let fetch_options = {method,headers};
  return (body?: Record<string, any>) =>{
    if (method == 'post'){
      const post_options = {...fetch_options, body:JSON.stringify(body)}; 
      return fetch(url, post_options);
    }
    return fetch(url, fetch_options);
  }
}