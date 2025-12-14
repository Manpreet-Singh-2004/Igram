"use server"
import {auth} from "@clerk/nextjs/server";
import {DBConnect} from "@/lib/DBConnect";
import User from "@/models/User.model";
import Product from "@/models/Product.model";

export async function ProductAddAction(data){
    try{
        await DBConnect();

        const {userId: clerkId} = await auth();
        if(!clerkId){
            return {success: false, message: 'Unauthorized | ProductAddAction'};
        }

        const seller = await User.findOne({clerkId})

        if(!seller){
            console.log('Could not find the seller in DB | ProductAddAction')
            return {success: false, message: 'Seller Not Found'};
        }

        if(seller.role !== "seller"){
            console.log('USERs CAN NOT ADD PRODUCTS | ProductAddAction')
        }

        const {
            name,
            description,
            images,
            price,
            stock,
            category,
            tags,
        } = data

        const newProduct = await Product.create({
            sellerId: seller._id,
            name,
            description,
            images,
            price: Number(price),
            stock: Number(stock),
            category,
            tags
        })

        console.log('Product Added | ProductAddAction')

        return {success: true, product: JSON.parse(JSON.stringify(newProduct))};

    } catch (error){
        console.error('ProductAddAction error | ProductAddAction: ', error);
        return{success: false, message: "Server error"}
    }
}