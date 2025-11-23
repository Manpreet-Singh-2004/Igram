"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@clerk/nextjs";
import PersonalInformation from "../../components/profile/PersonalInformation";
import ProductAdd from "../../components/profile/ProductAdd";
import ProductCard from '@/components/ProductCard'

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user) return;

      try {
        const res = await fetch(`/api/users/${user.id}`, { cache: "no-store" });
        const data = await res.json();
        setUserData(data);
        console.log("Profile user data:", data);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isLoaded]);

  // Fetching Seller Products

  useEffect(() =>{
    const fetchSellerProducts = async() =>{
      if(!userData || userData.role !== "seller") return;

      setLoadingProducts(true);
      try{
        const res = await fetch(`/api/products/seller/${userData._id}`);
        const data = await res.json();

        if(data.success){
          setSellerProducts(data.products);
          console.log("Seller Data is loaded")
        }

      } catch(error){
        console.error("Error fetching the seller products: ", error)
      } finally{
        setLoadingProducts(false);
      }
    };
    fetchSellerProducts();
  }, [userData])


  if (loading || !isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>User not found</h1>
      </div>
    );
  }

  // Values
  
  const {
    name,
    role
  } = userData

  return (
    <div className="flex h-screen p-10 gap-10">

      <div className="w-1/3">
        <PersonalInformation userData={userData} setUserData={setUserData} />
      </div>

      <div className="flex flex-col justify-start items-start w-2/3 gap-6">

        <h1 className="text-3xl font-bold">
          Welcome {name}, You are a {role}
        </h1>

      {/* Seller Start */}
        {role === "seller" && <ProductAdd />}

        {role === "seller" && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {loadingProducts ? (
              <Spinner />
            ) : sellerProducts.length > 0 ? (
              sellerProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No products added yet.</p>
            )}
          </div>
        )}
      {/* Seller End */}
      </div>
    </div>
  );
}
