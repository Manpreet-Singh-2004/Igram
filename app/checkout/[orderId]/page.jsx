import {getOrderForCheckout} from "../../../lib/actions/checkout/getOrderForCheckout"
import OrderSummary from '../../../components/checkout/OrderSummary'
import StripePaymentForm from "../../../components/checkout/StripePaymentForm";

export default async function CheckoutPage({params}){
    const {orderId} = await params

    const order = await getOrderForCheckout(orderId)

    if(!order){
        return(
            <div className='py-20 text-center'>
                <h1 className='text-2xl font-bold'>Invalid Checkout</h1>
            </div>
        )
    }

      const safeOrder = {
            ...order,
            _id: order._id.toString(),
            userId: order.userId.toString(),
            items: order.items.map((item) => ({
            ...item,
            _id: item._id.toString(),
            productId: item.productId.toString(),
            sellerId: item.sellerId.toString(),
            })),
        };

    return(
        <div className='max-w-6xl mx-auto py-10 px-6 grid md:grid-cols-2 gap-8'>
            <OrderSummary order={safeOrder} />
            <StripePaymentForm order={safeOrder} />
        </div>
    )
}