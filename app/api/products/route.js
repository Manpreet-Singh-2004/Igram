import {getLatestProducts} from '@/lib/actions/product/ProductGet';

export async function GET(){
    try{
        const products = await getLatestProducts(25);
        return Response.json({succees:true, products, status:200});
    } catch(error){
        return Response.json({success:false, message:error.message, status:500});
    }
}