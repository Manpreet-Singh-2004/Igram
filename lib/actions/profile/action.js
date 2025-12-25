"use server";

import { currentUser } from "@clerk/nextjs/server";
import { DBConnect } from "@/lib/DBConnect";
import User from "@/models/User.model";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData) {
  const user = await currentUser();
  if (!user) {
    throw new Error("AUTH_REQUIRED");
  }

  await DBConnect();

  const updatedUser = await User.findOneAndUpdate(
    { clerkId: user.id },
    {
      $set: {
        name: formData.name,
        phone: formData.phone,
        addresses: formData.addresses,
        sellerProfile: formData.sellerProfile,
      },
    },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedUser) {
    throw new Error("USER_NOT_FOUND");
  }

  revalidatePath("/profile");

  return {
    ok: true,
    user: JSON.parse(JSON.stringify(updatedUser)),
  };
}
