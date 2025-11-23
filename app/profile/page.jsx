"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@clerk/nextjs";
import PersonalInformation from "../../components/profile/PersonalInformation";
import ProductAdd from "../../components/profile/ProductAdd";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    email,
    phone,
    role,
    address,
    wishlist,
    sellerProfile,
    addresses
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
        {userData.role === "seller" && <ProductAdd />}
      {/* Seller End */}
      </div>
    </div>
  );
}
