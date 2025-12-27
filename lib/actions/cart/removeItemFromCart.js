"use server"

import {auth} from "@clerk/nextjs/server"
import {DBConnect} from "../../DBConnect"
import Cart from "../../../models/Cart.model"
import User from "../../../models/User.model";
import mongoose from "mongoose"

export async function removeFromCart(productId){

    const {userId:clerkId} = await auth()

    if(!clerkId){
        throw new Error("Unauthorized")
    }

    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new Error("Invalid product ID")
    }

    await DBConnect()

    const user = await User.findOne({clerkId}).select("_id").lean()
    if(!user){
        throw new Error("User not found")
    }

    await Cart.updateOne(
        {userId: user._id},
        {
            $pull:{
                items:{
                    productId: new mongoose.Types.ObjectId(productId),
                },
            },
        },
    );

}