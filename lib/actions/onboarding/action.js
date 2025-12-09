"use server"
import {DBConnect} from '@/lib/DBConnect'
import User from '@/models/User.model'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function onboardingCustomer(formData){
    const user = await currentUser();

    if(!user){
        throw new Error('User not authenticated | Onboarding SA');
    }
    try{
        await DBConnect();

        const updateData ={
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.emailAddresses[0].emailAddress,
            phone: formData.phone,
            addresses: formData.addresses,
            role: "user",
        }

        await User.findOneAndUpdate(
            {clerkId: user.id},
            {$set: updateData},
            {new: true, upsert: true}
        );
        console.log(`Onboarding completed for the user: ${user.id}`)
    } catch(error){
        console.error("Onboarding Customer Error:", error);
        return {success: false, error: "Failed to update profile. Please try again"}
    }
    redirect('/onboarding/complete')
}

export async function onboardingSeller(formData){
    const user = await currentUser();
    if(!user){
        throw new Error('User is not authenticated | Onboarding SA');
    }
    try{
        await DBConnect();
        const updateData = {
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.emailAddresses[0].emailAddress,
            phone: formData.phone,
            role: "seller",
            sellerProfile: {
                businessName: formData.businessName,
                businessAddress: formData.businessAddress
            },
        }
        await User.findOneAndUpdate(
            {clerkId: user.id},
            {$set: updateData},
            {new: true, upsert: true}
        )
        console.log(`Seller Onboarding completed for the user: ${user.id}`)
    } catch(error){
        console.error("Onboarding Seller Error:", error);
        return {success: false, error: "Failed to update seller profile"}
    }
    redirect('/onboarding/complete')
}