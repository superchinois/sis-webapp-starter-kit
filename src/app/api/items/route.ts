import { type NextRequest } from 'next/server'
import { getSession } from "@auth0/nextjs-auth0";

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
    const session = await getSession();

  if (!session) {
    throw Response.json({error:`Requires authentication`}, {status: 401, statusText: "User must be authenticated to request resource"})
  }

  const url_endpoint = "https://jsonplaceholder.typicode.com/users"
  const res = await fetch(url_endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
 
  return Response.json({ data })
}
