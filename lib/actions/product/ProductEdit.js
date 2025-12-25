"use server";

import { auth } from "@clerk/nextjs/server";
import { DBConnect } from "@/lib/DBConnect";
import User from "@/models/User.model";
import Product from "@/models/Product.model";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function editProductAction(productId, data) {
  await DBConnect();

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("AUTH_REQUIRED");
  }

  const seller = await User.findOne({ clerkId });
  if (!seller) {
    throw new Error("USER_NOT_FOUND");
  }

  if (seller.role !== "seller") {
    throw new Error("NOT_A_SELLER");
  }

  const existingProduct = await Product.findById(productId);
  if (!existingProduct) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (existingProduct.sellerId.toString() !== seller._id.toString()) {
    throw new Error("FORBIDDEN");
  }


  if (data.images) {
    const oldImages = existingProduct.images || [];
    const newImages = data.images;

    const oldFileIds = new Set(oldImages.map((img) => img.fileId));
    const newFileIds = new Set(newImages.map((img) => img.fileId));

    const fileIdsToDelete = [...oldFileIds].filter(
      (fileId) => !newFileIds.has(fileId)
    );

    if (fileIdsToDelete.length > 0) {
      await imagekit.bulkDeleteFiles(fileIdsToDelete);
    }

    existingProduct.images = newImages;
  }


  const allowedFields = [
    "name",
    "description",
    "price",
    "stock",
    "category",
    "tags",
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      existingProduct[field] = data[field];
    }
  }

  await existingProduct.save();

  return {
    ok: true,
    product: JSON.parse(JSON.stringify(existingProduct)),
  };
}
