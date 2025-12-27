export default function OrderSummary({order}){
    return(
        <div className="border rounded-xl p-6 space-y-4">
      <h2 className="text-xl font-bold">Order Summary</h2>

      {order.items.map((item) => (
        <div key={item.productId} className="flex justify-between">
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <hr />

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>${(order.subtotal).toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <span>Tax</span>
        <span>${(order.tax).toFixed(2)}</span>
      </div>

      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${(order.total).toFixed(2)}</span>
      </div>
    </div>
    )
}