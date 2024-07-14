'use server'
import { Claims, getSession } from "@auth0/nextjs-auth0";
import { build_fetch } from "@/lib/utils"
type FormState = {
success: number | undefined, 
data: Record<string, string> | undefined
}

interface OpeningData {
  date: string;
  persons: string[];
}

export async function getRizStats(formState: FormState, formData: FormData) {
  const session = await getSession();

  if (!session) {
    throw new Error(`Requires authentication`);
  }

  const { user } = session;

  const rawFormData = {
      start_date: formData.get('start-date'),
      end_date: formData.get('end-date')
  }
  const url_endpoint = "http://172.17.0.1:5000/items/stats/riz"
  const query_params = `?start=${rawFormData.start_date}&end=${rawFormData.end_date}`;
  const res = await fetch(url_endpoint+query_params, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const resData = res.json() || [];
  //const resData = [{itemcode: "123456", dscription: "toto", quantity: 100}]
  return resData;[]
}

export async function fetchOpeners():Promise<OpeningData[]> {
    const session = await getSession();
    if (!session) {
      throw new Error(`Requires authentication`);
    }
    const {username} = session.user;
    const url = `${process.env.MY_API_SERVER}/next_opening`;
    const getOpeners = await build_fetch({url, method: 'post', withAccessToken: true});
    const response = await getOpeners({username});
    return response.json();
}

