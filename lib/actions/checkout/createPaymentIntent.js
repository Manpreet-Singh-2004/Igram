"use server"

import Stripe from "stripe";
import {auth} from "@clerk/nextjs/server";
import {DBConnect} from "../../DBConnect"

import User from "@/models/User.model"
import Order from "@/models/Order.model";
import Payment from "@/models/Payment.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function createPaymentIntent(orderId){
    await DBConnect()

    const {userId: clerkId} = await auth()
    if(!clerkId){
        throw new Error("Unauthorized")
    }

    const user = await User.findOne({clerkId}).select("_id").lean();

    if(!user){
        throw new Error("User not found")
    }

    const order = await Order.findOne({
        _id: orderId,
        userId: user._id,
        status: "pending",
    });

    if(!order){
        throw new Error("Invalid Order")
    }

    // Conversion
    const amountInCents = Math.round(order.total * 100);

    const paymentIntent = await stripe.paymentIntent.create({
        amount: amountInCents,
        currency: "cad",
        metadata:{
            orderId: order._id.toString(),
        }
    })

    order.paymentAttempts =+ 1;
    order.stripePaymentIntentId = paymentIntent.id,
    await order.save();

    await Payment.create({
        orderId: order._id,
        stripePaymentIntentId: paymentIntent.id,
        amount: order.total, // cad
        currency: "CAD",
        status: "require_payment",
    })
}