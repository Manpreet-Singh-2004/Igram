import Product from "@/models/Product.model";
import {DBConnect} from '@/lib/DBConnect'
import { NextResponse } from "next/server";

export async function GET(req, {params}){
    try{
        await DBConnect()

        const {sellerId} = await params;
        console.log("SellerId:", sellerId);

        if(!sellerId){
            console.log(`Cannot find seller Id | Seller API`)
            return NextResponse.json(
                {success: false, message: "Missing Seller Id | Seller ID API"},
                {status: 400}
            )
        }

        const products = await Product.find({sellerId}).sort({createdAt: -1});
        console.log('Products Load Successfull | Seller API')
        return NextResponse.json(
            {success: true, products},
            {status: 200}
        )
    } catch(error){
        console.error("Seller Products API Error: ", error)
        return NextResponse.json(
            {success: false, message: "Server Error Seller API"},
            {status: 500}
        )
    }
}