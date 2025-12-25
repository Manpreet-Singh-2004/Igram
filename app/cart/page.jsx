import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/actions/cart/getCart";

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
        {cart.items.map((item, idx) => {
          const content = (
            <div className="flex gap-6 border rounded-xl p-4 items-center hover:bg-muted transition">
              {/* Image */}
              <div className="relative w-24 h-24 flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name ?? "Product"}
                    fill
                    className="object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg" />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h2 className="font-semibold text-lg">
                  {item.name ?? "Product unavailable"}
                </h2>

                {!item.isAvailable && (
                  <p className="text-sm text-red-500 mt-1">
                    This product is no longer available
                  </p>
                )}

                <p className="text-sm text-gray-500 mt-1">
                  Quantity: {item.quantity}
                </p>

                {/* Price */}
                <div className="mt-2">
                  <span className="font-semibold">
                    ${item.livePrice.toFixed(2)}
                  </span>

                  {item.priceDelta !== 0 && (
                    <span
                      className={`ml-3 text-sm ${
                        item.priceDelta > 0
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {item.priceDelta > 0
                        ? `↑ $${item.priceDelta.toFixed(2)}`
                        : `↓ $${Math.abs(item.priceDelta).toFixed(2)}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );

          // 🔒 Disable linking if product is deleted/unavailable
          return item.name ? (
            <Link
              key={idx}
              href={`/product/${item.productId}`}
              className="block"
            >
              {content}
            </Link>
          ) : (
            <div key={idx} className="opacity-60 cursor-not-allowed">
              {content}
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="mt-10 border-t pt-6 flex justify-between items-center">
        <p className="text-lg font-semibold">
          Items: {cart.itemCount}
        </p>
        <p className="text-2xl font-bold">
          Subtotal: ${cart.subtotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
