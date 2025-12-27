import CartItem from "@/components/cart/CartItem";
import { getCart } from "@/lib/actions/cart/getCart";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default async function CartPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-500">
          Add some products before checking out.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {cart.items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>

      <div className="mt-10 border-t pt-6 flex justify-between items-center">
        <p className="text-lg font-semibold">
          Items: {cart.itemCount}
        </p>
        <p className="text-2xl font-bold">
          Subtotal: ${cart.subtotal.toFixed(2)}
        </p>
      </div>

      <div className="mt-10 flex justify-end">
        <Link href="/checkout">
          <Button size="lg">
            Go to Checkout
          </Button>
        </Link>
      </div>

    </div>
  );
}
