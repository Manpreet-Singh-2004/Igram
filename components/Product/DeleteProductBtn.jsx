"use client"

import { useTransition } from "react";
import { deleteProduct } from "@/lib/actions/product/productDelete";
import { Loader2, Trash2 } from "lucide-react";
import {Button} from "@/components/ui/button";

export default function DeleteProductBtn({productId}){
    const [isPending, startTransition] = useTransition();

    const handleDelete = () =>{
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if(confirmDelete){
            startTransition(async() =>{
                await deleteProduct(productId);
            })
        }
    }
    return(
        <Button
            onClick={handleDelete}
            disabled={isPending}
        >
            {isPending ?(
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
                </>
            ) : (
                <>
                <Trash2 className="w-5 h-5" />
                Delete Product
                </>
            )
        }
        </Button>
    )
}