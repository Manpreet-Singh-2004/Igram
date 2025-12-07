"use server"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import {DBConnect} from '@/lib/DBConnect'
import User from '@/models/User.model'
import CustomerForm from './CustomerForm'

export default async function CustomerPage(){
  const user = await currentUser();
  if(!user){
    return redirect('/sign-in');
  }
  await DBConnect();
  const dbUser = await User.findOne({clerkId: user.id}).lean();

  if (dbUser?.role === 'seller') {
    console.log('User is a seller, redirecting to seller onboarding');
    return redirect("/onboarding/seller");
  }
  
  if(dbUser?.phone && dbUser?.addresses?.length > 0){
    console.log("Customer already onboarded, redirecting to home");
    return redirect('/')
  }
    console.log("Rendering Customer Onboarding Form");
    console.log(dbUser);
  const serializedUser = dbUser ? JSON.parse(JSON.stringify(dbUser)): null;
  return <CustomerForm dbUser={serializedUser} />
}