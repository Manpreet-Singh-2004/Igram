"use server"

import {auth} from "@clerk/nextjs/server"
import {DBConnect} from "../../DBConnect"
import Cart from "../../../models/Cart.model"
import User from "../../../models/User.model";
import mongoose from "mongoose"
import Product from "../../../models/Product.model";

export async function updateCartItemQuantity(productId, nextQuantity){

    const {userId: clerkId} = await auth();

    if(!clerkId){
        throw new Error("Unauthorized");
    }
    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new Error("Invalid product ID");
    }

    if(!Number.isInteger(nextQuantity) || nextQuantity < 1){
        throw new Error("Invalid quantity");
    }

    await DBConnect();

    const user = await User.findOne({clerkId}).select("_id").lean()

    if(!user){
        throw new Error("User not found");
    }
    
    const product = await Product.findById(productId).select("stock").lean()

    if(!product || product.stock < nextQuantity){
        throw new Error("Insufficient stock");
    }

    await Cart.updateOne(
        {
            userId: user._id,
            "items.productId": new mongoose.Types.ObjectId(productId),
        },
        {
            $set:{
                "items.$.quantity": nextQuantity,
            },
        },
    );
}