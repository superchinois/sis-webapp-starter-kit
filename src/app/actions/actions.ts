'use server'
import { Claims, getSession } from "@auth0/nextjs-auth0";

type FormState = {
success: number | undefined, 
data: Record<string, string> | undefined
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


function zip(arr1: string[], arr2: string[]) : Array<string[]> {
  return arr1.reduce((accumulator, curr, index) => {
    return [...accumulator, [curr, arr2[index]]];
  }, [] as Array<string[]>);
}

function toObject(zipped_values: Array<string[]>):Record<string, any> {
  return zipped_values.reduce((acc, z)=> Object.assign(acc, {[z[0]]:z[1]}), new Object() as Record<string, string>)
}

export async function fetchWith(url: string, body: Record<string, any>):Promise<ReturnType<typeof fetch>> {
    const encodedToken = getAccessToken();
    const method = 'post';
    const options = {
          method: method,
          headers: {
            Authorization: `Bearer ${encodedToken}`,
            "Content-Type": "application/json"
          }
        };
    if (method == 'post'){
        return fetch(url, {...options, body:JSON.stringify(body)});
    }
    return fetch(url,options);
}
export async function getAccessToken() {
  const values = [
    "AUTH0_TOKEN_ENDPOINT",
    "AUTH0_CLIENT_ID",
    "AUTH0_CLIENT_SECRET",
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