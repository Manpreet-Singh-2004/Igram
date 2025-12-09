"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { onboardingSeller } from "@/lib/actions/onboarding/action"
import Link from "next/link";

function SellerOnboarding() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState({
    label: "Business",
    country: "",
    city: "",
    postalCode: "",
    streetAddress: "",
  });

  const handleSubmit = async () => {
    if (!isLoaded || !user) return alert("User not loaded yet!");

    setLoading(true);

    const payload = {
      phone,
      businessName,
      businessAddress
    }
    const result = await onboardingSeller(payload);
    if(result?.error){
      alert(result.error);
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-2">Hello {fullName} 👋</h1>
      <h2 className="text-xl font-semibold mb-6">Seller Account Setup</h2>

      {/* Phone Input */}
      <Input
        placeholder="Phone Number"
        className="mb-4"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Business Name */}
      <Input
        placeholder="Business Name"
        className="mb-4"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
      />

      {/* Business Address */}
      {Object.keys(businessAddress).map((key) => (
        <Input
          key={key}
          className="mb-4"
          placeholder={key}
          value={businessAddress[key]}
          onChange={(e) =>
            setBusinessAddress({ ...businessAddress, [key]: e.target.value })
          }
        />
      ))}

            {/* Switch to customer */}
      <Link 
        href="/onboarding/customer" 
        className="block text-sm text-gray-600 mb-4 hover:underline"
      >
        Want to sign up as a customer instead?
      </Link>

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}

export default SellerOnboarding;