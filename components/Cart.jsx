"use client"
import { useCartStore } from '../store/cartStore'

const Cart = () =>{

    const {cart, removeFromCart, clearCart} = useCartStore()

    return(
        <div>
            <h2>Cart</h2>
            {cart.map((product) =>(
                <div key={product.id}>
                    <span>{product.name}</span>
                    <button
                    onClick={() => removeFromCart(product.id)}>
                        Remove
                    </button>
                </div>
            ))}
            {cart.length > 0 && (
                <button onClick={clearCart}>Clear Cart</button>
            )}
        </div>
    )
}

export default Cart;