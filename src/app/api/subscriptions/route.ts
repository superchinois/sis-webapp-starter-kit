import { type NextRequest } from 'next/server'
import { getSession } from "@auth0/nextjs-auth0";
import { build_fetch } from "@/lib/utils"

export const dynamic = 'force-dynamic';
const withAccessToken = true;
function authentication_error() {
    return Response.json({error:`Requires authentication`}, {status: 401, statusText: "User must be authenticated to request resource"})
}
async function getUserFromSession() {
    const session = await getSession();

      if (!session) {
        throw new Error('Failed to get session oject. Needs Authentication');
      }
    const {user} = session;
    return user ;
}

export async function GET(request: NextRequest) {
    try{
        const user = await getUserFromSession();
        const url = `${process.env.MY_API_SERVER}/api/is_subscribed?email=${user.email}`;
        const fetch_subscription = await build_fetch({url, withAccessToken, method:'get'})
        const res = await fetch_subscription();
        if(!res.ok) {
            return Response.json({error: res.statusText}, {status: res.status})
        }
        const data = await res.json()
        return Response.json({ data })
    } catch (error) {
        return authentication_error();
    }
}

export async function POST(request: NextRequest) {
    try{
        const user = await getUserFromSession();
        const url = `${process.env.MY_API_SERVER}/api/subscribe`
        const fetch_subscribe = await build_fetch({url, withAccessToken, method:'post'});
        const body = await request.json();
        const {subscription,topicId} = body;
        const {email, sub, username} = user;
        const fetch_body = {email, sub, username, subscription, topicId}
        const res = await fetch_subscribe(fetch_body);
        if(!res.ok) {
            return Response.json({error: res.statusText}, {status: res.status})
        }
        const data = await res.json();
        return Response.json({data})
    } catch (error){
        return authentication_error();
    }
}

export async function DELETE(request: NextRequest) {
    try{
        const user = await getUserFromSession();
        const url = `${process.env.MY_API_SERVER}/api/unsubscribe`;
        const fetch_unsubscribe = await build_fetch({url, withAccessToken, method:'post'});
        const res = await fetch_unsubscribe({email: user.email});
        if(!res.ok) {
            return Response.json({error: res.statusText}, {status: res.status})
        }
        const data = await res.json();
        return Response.json({data})
    } catch (error){
        return authentication_error();
    }
}