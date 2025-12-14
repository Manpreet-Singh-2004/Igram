"use client";

import {Button} from '../ui/button'
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({product}) {

  const imageUrl = product.images?.[0]?.url || '/placeholder-image.png';
  return (
    <Link href={`/product/${product._id}`}> 
    <div className="max-w-xs w-64 h-80 rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 flex flex-col">
      <img
        className="w-full h-48 object-cover"
        src={imageUrl}
        alt={product.name}
      />
      <div className="px-4 py-2">
        <h2 className="font-bold text-xl mb-1">{product.name}</h2>
        <p className="text-sm line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-semibold">${product.price}</span>
          <Button>
            Buy
          </Button>
          <Button>
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </div>
    </Link>
  );
}
