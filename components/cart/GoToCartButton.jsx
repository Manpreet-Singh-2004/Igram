import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function GoToCartButton() {
  return (
    <Link href="/cart">
      <Button className="flex items-center gap-2">
        <ShoppingCart size={18} />
        Go to Cart
      </Button>
    </Link>
  );
}
