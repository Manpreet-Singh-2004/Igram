import {DBConnect} from '@/lib/DBConnect'
import Product from '@/models/Product.model'
import User from '@/models/User.model';
import Image from 'next/image';
import {   
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
 } from "@/components/ui/carousel";
import { auth } from '@clerk/nextjs/server';
import DeleteProductBtn from '@/components/DeleteProductBtn';

export default async function ProductPage({params}){

    await DBConnect();
    const {id} = await params
    const product = await Product.findById(id).lean();

    if(!product){
        console.log("Product not found with id:", id);
        return <h1 className="text-center mt-20 text-2xl">Product not found</h1>
    }

    const {userId: clerkId} = await auth();

    let isSeller = false;

    if(clerkId){
      const currentUser = await User.findOne({clerkId}).select("_id").lean()

      if(currentUser && currentUser._id.toString() === product.sellerId.toString()){
        isSeller = true;
      }
    }

    return(
       <div className="max-w-5xl mx-auto py-10 px-6 grid grid-cols-1 md:grid-cols-2 gap-10">

      <Carousel className="w-full rounded-lg relative">
        <CarouselContent className="h-[500px]">
          {product.images?.map((img, idx) => (
            <CarouselItem 
              key={idx} 
              className="w-full h-[500px]"
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt={`${product.name}-${idx}`}
                  fill
                  className="object-contain bg-black/5 rounded-lg"
                  priority={idx === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2 bg-white/80 shadow-lg hover:bg-white" />
        <CarouselNext className="right-2 bg-white/80 shadow-lg hover:bg-white" />
      </Carousel>

      <div className="flex flex-col justify-start">
        <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-5">{product.description}</p>
        <p className="text-2xl font-semibold mb-5">${product.price}</p>
        <p className="text-sm mb-3 text-gray-500">Stock: {product.stock}</p>

        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
          Buy Now
        </button>

          {isSeller &&(
              <DeleteProductBtn productId={product._id.toString()} />
            )
          }

      </div>
    </div>
    )
}