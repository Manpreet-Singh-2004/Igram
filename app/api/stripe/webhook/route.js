import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { DBConnect } from "../../../../lib/DBConnect"
import Order from "../../../../models/Order.model"
import Payment from "../../../../models/Payment.model"
import Cart from "../../../../models/Cart.model"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req){
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature")

    let event;

    try{
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch(err){
        console.error("Webhook signature verification failed ", err.message)
        return new NextResponse("Invalid signature, ", {status: 400})
    }

    await DBConnect()

    switch (event.type){
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;

            if(!orderId) break;

            await Order.findByIdAndUpdate(orderId, {
                status: "paid",
            })

            await Payment.findOneAndUpdate(
                {stripePaymentIntentId: paymentIntent.id},
                {
                    status: "succeeded",
                    stripeChargeId: paymentIntent.latest_charge,
                }
            )

            const order = await Order.findById(orderId).select("userId");
            if(order){
                await Cart.findOneAndUpdate(
                    {userId: order.userId},
                    {items: []}
                );
            }
            break
        }

        case "payment_intent.payment_failed":{
            const paymentIntent = event.data.object;

            await Payment.findOneAndUpdate(
                {stripePaymentIntentId: paymentIntent.id},
                {status: "failed"}
            );
            break
        }
        default:
            console.log("Unhandled event: ", event.type)
    }
    return NextResponse.json({recieved: true})
}