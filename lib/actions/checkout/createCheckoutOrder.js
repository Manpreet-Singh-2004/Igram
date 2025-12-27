"use server";

import { auth } from "@clerk/nextjs/server";
import { DBConnect } from "@/lib/DBConnect";

import User from "@/models/User.model";
import Cart from "@/models/Cart.model";
import Product from "@/models/Product.model";
import Order from "@/models/Order.model";

export async function createCheckoutOrder() {
  await DBConnect();

  // 1️⃣ Auth
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ clerkId })
    .select("_id")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  // 2️⃣ Fetch cart
  const cart = await Cart.findOne({ userId: user._id }).lean();
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 3️⃣ Normalize product IDs (DEFENSIVE)
  const productIds = cart.items.map((i) =>
    typeof i.productId === "string"
      ? i.productId
      : i.productId.toString()
  );

  // 4️⃣ Fetch products (DO NOT trust cart)
  const products = await Product.find({
    _id: { $in: productIds },
  })
    .select("_id name price stock sellerId")
    .lean();

  const productMap = new Map(
    products.map((p) => [p._id.toString(), p])
  );

  let subtotal = 0;
  const orderItems = [];

  // 5️⃣ Validate + build order items
  for (const item of cart.items) {
    const productIdStr =
      typeof item.productId === "string"
        ? item.productId
        : item.productId.toString();

    const product = productMap.get(productIdStr);

    if (!product) {
      throw new Error("Product no longer exists");
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    orderItems.push({
      productId: product._id,
      name: product.name,
      price: product.price, // CAD
      quantity: item.quantity,
      sellerId: product.sellerId,
    });
  }

  // 6️⃣ Totals (CAD)
  const tax = 2; // fixed tax (learning project)
  const total = subtotal + tax;

  // 7️⃣ Create LOCKED order
  const order = await Order.create({
    userId: user._id,
    items: orderItems,
    subtotal,
    tax,
    total,
    currency: "CAD",
    status: "pending",
    locked: true,
    paymentAttempts: 0,
  });

  return order._id.toString();
}
