"use client"

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js"
import {useState} from "react"

export default function StripePaymentForm(){
  const stripe = useStripe()
  const elements = useElements()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!stripe || !elements) return;

    setLoading(true)
    setError(null)

    const {error} = await stripe.confirmPayment({
      elements,
      confirmParams:{
        return_url: `${window.location.origin}/checkout/success`,
      },
    })
    
    if(error){
      setError(error.message)
      setLoading(false)
    }
  };

  return(
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        disabled={!stripe || loading}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing…" : "Pay Now"}
      </button>
    </form>
  )
}