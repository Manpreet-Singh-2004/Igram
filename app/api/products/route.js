// General Products API POST and GET

import { NextResponse } from "next/server";
import {DBConnect} from '@/lib/DBConnect'
import User from '@/models/User.model'
import Product from '@/models/Product.model'
import { auth } from "@clerk/nextjs/server";

export async function GET(){
    try{
        await DBConnect();

        const products = await Product.find({}).sort({createdAt: -1}).limit(25)

        console.log('Products successfully Loaded | Products API')
        return Response.json({success: true, products}, {status: 200})
    } catch(error){
        console.error('Get Products error | Products API: ', error)
        return Response.json(
            {success: false, message: "Server error"},
            {status: 500}
        );
    }
}

export async function POST(req){
    try{
        await DBConnect();

        const {userId: clerkId} = await auth();

        if(!clerkId){
            return NextResponse.json({error: 'Unauthorized | api/products POST'}, {status: 401});
        }

        const body = await req.json();
        const {
            name,
            description,
            images,
            price,
            stock,
            category,
            tags,
        } = body;

        const seller = await User.findOne({clerkId});

        if(!seller){
            console.log('Could not find the seller in DB | Product API')
            return NextResponse.json(
                {error: 'Seller Not Found'},
                {status: 404}
            );
        }

        if(seller.role !== "seller"){
            console.log('USERs CAN NOT ADD PRODUCTS | Product API')
            return NextResponse.json(
                {error: 'Only Seller can add products'},
                {status: 403}
            );
        }

        const newProduct = await Product.create({
            sellerId: seller._id,
            name,
            description,
            images: images,
            price,
            stock,
            category,
            tags,
        })

        console.log('Product Added | Product API')
        return NextResponse.json(newProduct, {status: 201})
    } catch(error){
        console.error('Error during Product creation: ', error)
        return NextResponse.json(
            {error: 'Server error while adding Product | Product API'},
            {status: 500}
        )
    }
}