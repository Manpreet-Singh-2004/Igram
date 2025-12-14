"use server"

import { currentUser } from "@clerk/nextjs/server"
import { DBConnect } from "@/lib/DBConnect";
import User from "@/models/User.model";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData){
    const user = await currentUser();
    if(!user){
        throw new Error("Unauthorized");
    }
    await DBConnect();
    try{
        const updatedUser = await User.findOneAndUpdate(
            {clerkId: user.id},
            {
                $set:{
                    name: formData.name,
                    phone: formData.phone,
                    addresses: formData.addresses,
                    sellerProfile: formData.sellerProfile
                }
            },
            {new: true, runValidators: true }
        ).lean();
        
        revalidatePath("/profile");

        console.log("User profile updated:", updatedUser);
        return {success: true, user: JSON.parse(JSON.stringify(updatedUser))}
     } catch(error){
        console.error("Error updating user profile:", error);
        return {success: false, error: "Failed to update profile"};
     }
}