"use client";

import { useTransition } from "react";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/actions/cart/addToCart";

export default function AddToCartButton({ productId }) {
  const [isPending, startTransition] = useTransition();
  const { openSignIn } = useClerk();

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCart(productId);
        toast.success("Added to cart");
      } catch (err) {
        // 🔑 Server action threw → inspect error code
        if (err?.message === "AUTH_REQUIRED") {
          toast.error("Please sign in to add items to your cart");
          openSignIn();
          return;
        }

        if (err?.message === "OUT_OF_STOCK") {
          toast.error("This product is out of stock");
          return;
        }

        if (err?.message === "MAX_QTY_REACHED") {
          toast.error("You’ve reached the maximum quantity (99)");
          return;
        }

        console.error(err);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleAddToCart}
      className="flex items-center gap-2"
    >
      <ShoppingCart size={18} />
      {isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
