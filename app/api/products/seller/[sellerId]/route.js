import Product from ".@/models/Product.model";
import DBConnect from '@/lib/DBConnect'

export async function GET(req, {params}){
    try{
        await DBConnect()

        const {sellerId} = params;
        const products = await Product.find({sellerId});

        return Response.json(
            {success: true, products},
            {status: 200}
        )
    } catch(error){
        console.error("Seller Products API Error: ", error)
        return Response.json(
            {success: false, message: "Server Error Seller API"},
            {status: 500}
        )
    }
}