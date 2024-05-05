import { type NextRequest } from 'next/server'

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const url_endpoint = "https://jsonplaceholder.typicode.com/users"
  const res = await fetch(url_endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
 
  return Response.json({ data })
}
