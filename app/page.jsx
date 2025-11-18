"use client"

import Cart from "../components/Cart"
import ProductList from "../components/ProductList"
import {PRODUCTS} from "../components/products"


export default function Home(){
  

  return(
    <div className="">
      <h3>Welcome to store</h3>
      <ProductList products={PRODUCTS} />
      <Cart />
    </div>
  )
}