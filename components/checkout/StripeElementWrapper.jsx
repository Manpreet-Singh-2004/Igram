"use client"

import { useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

import { createPaymentIntent } from "../../lib/actions/checkout/createPaymentIntent"
import StripePaymentForm from "../checkout/StripePaymentForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function StripeElementWrapper({orderId}){
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() =>{
        createPaymentIntent(orderId).then(setClientSecret)
    }, [orderId])

    if(!clientSecret) return <p>Preparing payment...</p>

    return(
        <Elements stripe={stripePromise} options={{clientSecret}}>
            <StripePaymentForm />
        </Elements>
    )
}