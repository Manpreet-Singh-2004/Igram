"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { removeFromCart } from "../../lib/actions/cart/removeItemFromCart";

export default function CartItem({ item }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromCart(item.productId);
      router.refresh();
    });
  };

  return (
    <div
      className={`flex gap-6 border rounded-xl p-4 items-center transition
        ${item.isAvailable ? "hover:bg-muted" : "opacity-60"}
      `}
    >
      {/* CLICKABLE PRODUCT AREA */}
      {item.name ? (
        <Link
          href={`/product/${item.productId}`}
          className="flex gap-6 items-center flex-1"
        >
          {/* Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg" />
            )}
          </div>

          {/* Product Info */}
          <div>
            <h2 className="font-semibold text-lg">{item.name}</h2>

            {!item.isAvailable && (
              <p className="text-sm text-red-500 mt-1">
                This product is no longer available
              </p>
            )}

            <p className="text-sm text-gray-500 mt-1">
              Quantity: {item.quantity}
            </p>

            <div className="mt-2 flex items-center gap-3">
              <span className="font-semibold">
                ${item.livePrice.toFixed(2)}
              </span>

              {item.priceDelta !== 0 && (
                <span
                  className={`text-sm ${
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
        </Link>
      ) : (
        <div className="flex-1">
          <h2 className="font-semibold text-lg">Product unavailable</h2>
        </div>
      )}

      {/* ACTIONS (NOT INSIDE LINK) */}
      <Button
        clickable
        onClick={handleRemove}
        disabled={isPending}
        variant="ghost"
        className="text-red-500 hover:text-red-600 disabled:opacity-50"
      >
        {isPending ? "Removing..." : "Remove"}
      </Button>
    </div>
  );
}
