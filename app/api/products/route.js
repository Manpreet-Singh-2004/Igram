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