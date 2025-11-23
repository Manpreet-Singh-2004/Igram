"use client"

import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { Spinner } from '@/components/ui/spinner';

export default function Home(){

    const [products, setProducts] = useState([]);

    useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }

    fetchProducts();
  }, []);

    return(
    <div className='px-6'>
      <h1 className='text-3xl font-bold'>Welcome to Home page</h1>
      <h2>All your fav products in one place</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p._id} product={p} />)
        ) : (
          <div>
            <p>Loading</p>
            <Spinner />
          </div>
        )}
      </div>
    </div>
    )
}