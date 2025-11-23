import {DBConnect} from '@/lib/DBConnect'
import Product from '@/models/Product.model'
import Image from 'next/image';
import { Carousel, CarouselItem } from "@/components/ui/carousel";

export default async function ProductPage({params}){

    await DBConnect();
    const {id} = await params
    const product = await Product.findById(id).lean();

    if(!product){
        return <h1 className="text-center mt-20 text-2xl">Product not found</h1>
    }

    return(
<div className="max-w-5xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      
      {/* Carousel for multiple images */}
      <Carousel className="w-full h-96 rounded-lg overflow-hidden">
        {product.imagesURL.map((img, idx) => (
          <CarouselItem key={idx} className="relative w-full h-96">
            <Image
              src={img}
              alt={`${product.name} - ${idx + 1}`}
              fill
              style={{ objectFit: "cover" }}
              priority={idx === 0} 
            />
          </CarouselItem>
        ))}
      </Carousel>

      {/* Product info */}
      <div className="flex flex-col justify-start">
        <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-5">{product.description}</p>
        <p className="text-2xl font-semibold mb-5">${product.price}</p>
        <p className="text-sm mb-3 text-gray-500">Stock: {product.stock}</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
          Buy Now
        </button>
      </div>
    </div>
    )
}