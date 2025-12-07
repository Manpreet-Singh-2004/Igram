"use server"

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { DBConnect } from "@/lib/DBConnect";
import User from "@/models/User.model";
import SellerOnboarding from "./SellerOnboarding";

export default async function SellerPage() {
    const user = await currentUser();
    if (!user) {
        return redirect("/sign-in");
    }
    await DBConnect();
    const dbUser = await User.findOne({ clerkId: user.id }).lean();

    if (dbUser?.role === 'seller' && dbUser?.sellerProfile?.businessName){
        console.log("Seller already onboarded, redirecting to home");
        return redirect('/')
    }
    console.log("Rendering Seller Onboarding Form");
    const serializedUser = dbUser ? JSON.parse(JSON.stringify(dbUser)) : null;
    return <SellerOnboarding dbUser={serializedUser} />;
}