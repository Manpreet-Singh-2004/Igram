"use server"

import { auth } from "@clerk/nextjs/server";
import { DBConnect } from "@/lib/DBConnect";
import User from "@/models/User.model";
import Product from "@/models/Product.model";
import ImageKit from "imagekit";


const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function editProductAction(productId, data) {
    try{
        await DBConnect();
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return { success: false, message: 'Unauthorized | ProductEdit' };
        }
        const seller = await User.findOne({clerkId})
        if(!seller){
            return {success: false, message: 'Seller Not Found'};
        }

        if(seller.role !== "seller"){
            console.log('USERs CAN NOT EDIT PRODUCTS | ProductEdit')
        }

        const existingProduct = await Product.findById(productId)
        if(!existingProduct){
            return {success: false, message: 'Product Not Found'};
        }

        if(existingProduct.sellerId.toString() !== seller._id.toString()){
            return {success: false, message: 'Unauthorized to edit this product'};
        }

        // Image Handling
        if (data.images){
            const oldImages = existingProduct.images || []
            const newImages = data.images

            const oldFileIds = new Set(oldImages.map(img => img.fileId));
            const newFileIds = new Set(newImages.map(img => img.fileId));

            const fileIdsToDelete = [...oldFileIds].filter(
                (fileId) => !newFileIds.has(fileId)
            )
            if(fileIdsToDelete.length > 0){
                console.log("Deleting old images: ", fileIdsToDelete)
                await imagekit.bulkDeleteFiles(fileIdsToDelete)
            }
            existingProduct.images = newImages
        }

        // Other fields

        const allowedFields = [
            'name',
            'description',
            'price',
            'stock',
            'category',
            'tags'
        ];

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                existingProduct[field] = data[field];
            }
        })

        await existingProduct.save();
        console.log('Product Edited | ProductEdit')

        return { success: true, product: JSON.parse(JSON.stringify(existingProduct)) };

        
    } catch (error){
        console.error('DB Connection error | ProductEdit: ', error);
        return {success: false, message: "Database connection error"};
    }
}