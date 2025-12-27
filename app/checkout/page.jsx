import { redirect } from "next/navigation";
import {createCheckoutOrder} from "@/lib/actions/checkout/createCheckoutOrder";

export default async function CheckoutEntryPage(){
    const orderId = await createCheckoutOrder();

    redirect(`/checkout/${orderId}`);
}