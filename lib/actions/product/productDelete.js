"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DBConnect } from "@/lib/DBConnect";
import Product from "@/models/Product.model";
import User from "@/models/User.model";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function deleteProduct(productId) {
  await DBConnect();

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("AUTH_REQUIRED");
  }

  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (product.sellerId.toString() !== user._id.toString()) {
    throw new Error("FORBIDDEN");
  }

  if (product.images?.length > 0) {
    const fileIds = product.images.map((img) => img.fileId);
    await imagekit.bulkDeleteFiles(fileIds);
  }

  await Product.findByIdAndDelete(productId);

  revalidatePath("/");
  redirect("/");
}
