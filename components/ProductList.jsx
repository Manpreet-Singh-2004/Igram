"use client"

import { useCartStore } from '../store/cartStore'

const ProductList = ({products}) =>{

    const addToCart = useCartStore((state) => state.addToCart)

    return(
        <div>
            {products?.map((product) =>(
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <button onClick={() => addToCart(product)}>
                        Add to cart
                    </button>
                </div>
            ))}
        </div>
    )
}

export default ProductList;