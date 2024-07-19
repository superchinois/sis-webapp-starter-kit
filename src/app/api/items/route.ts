import { type NextRequest } from 'next/server'
import { getSession } from "@auth0/nextjs-auth0";
import fuzzaldrinPlus from 'fuzzaldrin-plus'


export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {

  const url_endpoint = "https://jsonplaceholder.typicode.com/users"
  const res = await fetch(url_endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const term="Dennis";
  const data = await res.json();
  const results = fuzzaldrinPlus.filter(data, term, { key: 'name' })
  return Response.json({ results })
}
