"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { onboardingCustomer } from "@/lib/actions/onboarding/action";
import Link from "next/link";

function CustomerForm() {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);


  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState({
    label: "Home",
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
      addresses: [address],
    }
    const result = await onboardingCustomer(payload);

    if(result?.error){
      alert(result.error);
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-2">Hello {fullName} 👋</h1>
      <h2 className="text-xl font-semibold mb-6">Complete your account setup</h2>

      {/* Phone Input */}
      <Input
        placeholder="Phone Number"
        className="mb-4"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Address Inputs */}
      {Object.keys(address).map((key) => (
        <Input
          key={key}
          className="mb-4"
          placeholder={key}
          value={address[key]}
          onChange={(e) =>
            setAddress({ ...address, [key]: e.target.value })
          }
        />
      ))}

      {/* Switch to seller */}
      <Link 
        href="/onboarding/seller" 
        className="block text-sm text-gray-600 mb-4 hover:underline"
      >
        Want to sign up as a seller instead?
      </Link>

      <Button onClick={handleSubmit} disabled={loading}>Submit</Button>
    </div>
  );
}

export default CustomerForm