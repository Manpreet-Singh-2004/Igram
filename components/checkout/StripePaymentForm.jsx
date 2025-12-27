"use client"

export default function StripePaymentForm({order}){
    return(
            <div className="border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Payment</h2>

      <div className="h-32 border border-dashed flex items-center justify-center">
        Stripe Elements will go here
      </div>

      <button
        className="mt-6 w-full bg-black text-white py-2 rounded"
      >
        Pay ${ (order.total / 100).toFixed(2) }
      </button>
    </div>
    )
}