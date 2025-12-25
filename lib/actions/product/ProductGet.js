import {DBConnect} from '@/lib/DBConnect'
import Product from '@/models/Product.model'

export async function getLatestProducts(limit=25){
    await DBConnect();
    return Product.find({}).sort({createdAt: -1}).limit(limit).lean();
}
