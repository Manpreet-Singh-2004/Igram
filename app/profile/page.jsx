import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DBConnect } from "@/lib/DBConnect";
import PersonalInformation from "@/components/profile/PersonalInformation";
import ProductAdd from "@/components/profile/ProductAdd";
import ProductCard from '@/components/ProductCard'
import Product from "@/models/Product.model";
import User from "@/models/User.model";

export default async function ProfilePage() {

  const user = await currentUser();
  if(!user) return redirect("/sign-in");

  await DBConnect()

  const dbUser = await User.findOne({clerkId: user.id}).lean();
  if(!dbUser){
    return(
      console.log("User not found in database"),
      <div>
        User not found in database
      </div>
    )
  }

  let sellerProducts = []
  if(dbUser.role === "seller"){
    sellerProducts = await Product.find({sellerId: dbUser._id}).lean();
  }

  const serializedUser = JSON.parse(JSON.stringify(dbUser))
  const serializedProducts = JSON.parse(JSON.stringify((sellerProducts)))

  return(
    <div className="flex min-h-screen p-10 gap-10">
        <div className="w-1/3">
          <PersonalInformation userData={serializedUser} />
        </div>
        <div className="flex flex-col justify-start items-start w-2/3 gap-6">
        <h1 className="text-3xl font-bold">
          Welcome {serializedUser.name}, You are a {serializedUser.role}
        </h1>

        {/* Seller Section */}
        {serializedUser.role === "seller" && (
          <>
            <ProductAdd />
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {serializedProducts.length > 0 ? (
                serializedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p>No products added yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
