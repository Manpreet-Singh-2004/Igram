"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { removeFromCart } from "../../lib/actions/cart/removeItemFromCart";
import { updateCartItemQuantity } from "../../lib/actions/cart/updateQty";

export default function CartItem({ item }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [qty, setQty] = useState(item.quantity);

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromCart(item.productId);
      router.refresh();
    });
  };

  const handleChange = (nextQty) => {
    if (nextQty < 1 || nextQty > item.stock) return;

    setQty(nextQty);

    startTransition(async () => {
      try {
        await updateCartItemQuantity(item.productId, nextQty);
        router.refresh();
      } catch {
        setQty(item.quantity);
      }
    });
  };

  return (
    <div
      className={`border rounded-xl p-4 transition
        ${item.isAvailable ? "hover:bg-muted" : "opacity-60"}
      `}
    >
      {/* TOP: product info */}
      <div className="flex gap-4 items-center">
        {item.name ? (
          <Link
            href={`/product/${item.productId}`}
            className="flex gap-4 items-center flex-1"
          >
            <div className="relative w-20 h-20 flex-shrink-0">
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

            <div>
              <h2 className="font-semibold">{item.name}</h2>

              {!item.isAvailable && (
                <p className="text-sm text-red-500">
                  This product is no longer available
                </p>
              )}

              <div className="mt-1 flex items-center gap-3 text-sm">
                <span className="font-semibold">
                  ${item.livePrice.toFixed(2)}
                </span>

                {item.priceDelta !== 0 && (
                  <span
                    className={
                      item.priceDelta > 0
                        ? "text-red-500"
                        : "text-green-600"
                    }
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
          <div className="flex-1 font-semibold">Product unavailable</div>
        )}
      </div>

      {/* BOTTOM: actions */}
      <div
        className="
          mt-4
          flex flex-col gap-3
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        {/* Quantity controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            disabled={qty <= 1 || isPending}
            onClick={() => handleChange(qty - 1)}
          >
            −
          </Button>

          <span className="min-w-[24px] text-center">{qty}</span>

          <Button
            variant="outline"
            size="icon"
            disabled={qty >= item.stock || isPending}
            onClick={() => handleChange(qty + 1)}
          >
            +
          </Button>
        </div>

        {/* Remove */}
        <Button
          onClick={handleRemove}
          disabled={isPending}
          variant="ghost"
          className="    
    bg-red-600 text-white
    hover:bg-red-700

    dark:bg-red-500
    dark:hover:bg-red-600

    disabled:bg-red-400
    dark:disabled:bg-red-400

    disabled:cursor-not-allowed
    self-start sm:self-auto
    "
        >
          {isPending ? "Removing..." : "Remove"}
        </Button>
      </div>
    </div>
  );
}
