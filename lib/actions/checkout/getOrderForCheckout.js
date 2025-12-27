"use server"

import {auth} from "@clerk/nextjs/server"
import {DBConnect} from "../../DBConnect"
import Order from "../../../models/Order.model"
import User from "../../../models/User.model"

export async function getOrderForCheckout(orderId){
    await DBConnect()

    const {userId: clerkId} = await auth()
    if(!clerkId) return null;

    const user = await User.findOne({clerkId}).select("_id").lean()
    if(!user) return null

    const order = await Order.findOne({
        _id: orderId,
        userId: user._id,
    }).lean()

    if(!order ||  !order.locked) return null

    return order;
}