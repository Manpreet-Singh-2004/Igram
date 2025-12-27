"use server";

import { auth } from "@clerk/nextjs/server";
import { DBConnect } from "@/lib/DBConnect";
import User from "@/models/User.model";
import Product from "@/models/Product.model";
import Cart from "@/models/Cart.model";

export async function getCart() {
  await DBConnect();

  const { userId: clerkId } = await auth();
    console.log("CLERK ID:", clerkId);

  if (!clerkId) {
    return { items: [], subtotal: 0, itemCount: 0 };
  }

  const user = await User.findOne({ clerkId }).select("_id").lean();
      console.log("MONGO USER:", user);

  if (!user) {
    return { items: [], subtotal: 0, itemCount: 0 };
  }

  const cart = await Cart.findOne({ userId: user._id }).lean();
      console.log("CART FOUND:", cart);

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return { items: [], subtotal: 0, itemCount: 0 };
  }

  const productIds = cart.items.map(i => i.productId);

  const products = await Product.find({
    _id: { $in: productIds }
  })
    .select("_id name price stock images sellerId")
    .lean();

  const productMap = new Map(
    products.map(p => [p._id.toString(), p])
  );

  let subtotal = 0;
  let itemCount = 0;

  const items = cart.items.map(item => {
    const product = productMap.get(item.productId.toString());

    if (!product) {
      return {
        productId: item.productId.toString(),
        quantity: item.quantity,
        isAvailable: false,
      };
    }

    const livePrice = product.price;
    const priceDelta = livePrice - item.priceSnapshot;

    subtotal += livePrice * item.quantity;
    itemCount += item.quantity;

    return {
      productId: product._id.toString(),
      name: product.name,
      image: product.images?.[0]?.url ?? null,
      sellerId: item.sellerId.toString(),
      quantity: item.quantity,
      livePrice,
      priceSnapshot: item.priceSnapshot,
      priceDelta,
      stock: product.stock,
      isAvailable: product.stock >= item.quantity,
    };
  });

  return { items, subtotal, itemCount };
}
