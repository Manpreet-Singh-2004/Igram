"use server";

import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { DBConnect } from "@/lib/DBConnect";
import User from "@/models/User.model";
import Product from "@/models/Product.model";
import Cart from "@/models/Cart.model";

export async function addToCart(productId) {
  await DBConnect();

  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("AUTH_REQUIRED");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("INVALID_PRODUCT");
  }

  const user = await User.findOne({ clerkId }).select("_id");
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const product = await Product.findById(productId).select(
    "_id price sellerId stock"
  );

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (product.stock < 1) {
    throw new Error("OUT_OF_STOCK");
  }

  let cart = await Cart.findOne({ userId: user._id });
  if (!cart) {
    cart = await Cart.create({ userId: user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === product._id.toString()
  );

  if (existingItem) {
    if (existingItem.quantity >= 99) {
      throw new Error("MAX_QTY_REACHED");
    }
    existingItem.quantity += 1;
  } else {
    cart.items.push({
      productId: product._id,
      sellerId: product.sellerId,
      quantity: 1,
      priceSnapshot: product.price,
      addedAt: new Date(),
    });
  }

  await cart.save();
  revalidatePath("/cart");

  return { ok: true };
}
