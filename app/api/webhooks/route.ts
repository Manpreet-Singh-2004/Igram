// app/api/webhooks/route.ts

import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { DBConnect } from '@/lib/DBConnect';
import User from '@/Models/User.model';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    if (evt.type === 'user.created') {

      try{
        await DBConnect();
        console.log("Webhook Recieved: Creating user in MongoDB...")

        const {id, first_name, last_name} = evt.data;

        const existingUser = await User.findOne({clerkId: id});
        if(existingUser){
          console.log("User already exists in the database.");
          return new Response('User already exists', {status: 200});
        }

        await User.create({
          clerkId: id,
          name: `${first_name} ${last_name || ''}`.trim(),
          email: evt.data.email_addresses[0].email_address,
        });

        console.log("User created successfully in MongoDB.");
        return new Response('user Created', {status: 201});

      } catch(error){
        console.error("Error handling user.create webhook: ", error)
        return new Response("Error Occured during user creation in DB", {status: 500})
      }
}

if(evt.type==='user.deleted'){
  try{
    await DBConnect();
    console.log("Webhook recieved: Deleting user in MongoDB...");

    const {id} = evt.data;
    await User.findOneAndDelete({clerkId: id});
    console.log("User successfully deleted from MongoDB.")
    return new Response('User Deleted', {status: 200});

  } catch(error){
    console.log("Error handling user.delete webhook: ", error)
    return new Response("Error occured during user deletion in DB", {status: 500});
  }
}

  return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}