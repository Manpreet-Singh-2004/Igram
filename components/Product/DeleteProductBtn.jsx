"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/lib/actions/product/productDelete";

export default function DeleteProductBtn({ productId }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProduct(productId);
        toast.success("Product deleted successfully");
        // redirect happens in server action
      } catch (err) {
        console.error("Delete product error:", err);

        if (err?.message === "Unauthorized") {
          toast.error("Please sign in to delete this product");
          return;
        }

        if (err?.message === "You are not authorized to delete this product") {
          toast.error("You are not allowed to delete this product");
          return;
        }

        toast.error("Failed to delete product. Please try again.");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Product
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The product and all its images will be
            permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
