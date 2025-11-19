"use client";

import {Button} from './ui/button'

export default function ProductCard() {
  // Hard-coded product object
  const product = {
    name: "Cool Sneakers",
    description: "Comfortable and stylish sneakers for everyday wear.",
    price: 79.99,
    image: "https://d1fufvy4xao6k9.cloudfront.net/feed/img/man_sneaker/876768/side.png",
  };

  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
      <img
        className="w-full h-48 object-cover"
        src={product.image}
        alt={product.name}
      />
      <div className="px-4 py-2">
        <h2 className="font-bold text-xl mb-1">{product.name}</h2>
        <p className="text-gray-600 text-sm">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-semibold">${product.price}</span>
          <Button>
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
}
