"use server"
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DBConnect } from "@/lib/DBConnect";
import Product from "@/models/Product.model";
import User from "@/models/User.model";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,   
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
})

export async function deleteProduct(productId){
    try{
        await DBConnect();

        const {userId: clerkId} = await auth();
        if(!clerkId){
            throw new Error('Unauthorized');
        }

        const user = await User.findOne({clerkId})
        if(!user){
            throw new Error('User not found');
        }
        const product = await Product.findById(productId);
        if(product.sellerId.toString() !== user._id.toString()){
            throw new Error('You are not authorized to delete this product');
        }

        if(product.images && product.images.length > 0){
            const fileIds = product.images.map((img) => img.fileId);
            if(fileIds.length > 0){
                console.log("Deleting images from ImageKit:", fileIds);
                await imagekit.bulkDeleteFiles(fileIds);
            }
        }

        await Product.findByIdAndDelete(productId);
        revalidatePath("/")
    } catch(error){
        console.error("Delete Product error | Product Actions:", error);
        throw new Error (error.message || "Failed to delete product");
    }
    redirect("/");
}