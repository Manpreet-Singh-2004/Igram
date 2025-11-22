"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@clerk/nextjs";

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

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5">
      <h1 className="text-3xl font-bold">
        Welcome {userData.name}, You are a{" "}
        {userData.role}
      </h1>

      {/* Seller Start */}
      {userData.role === "seller" && <Button>Add Products</Button>}
      

      {/* Seller End */}
      {/* User Start */}
    </div>
  );
}
