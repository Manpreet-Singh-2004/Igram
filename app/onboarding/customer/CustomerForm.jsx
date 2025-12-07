"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function CustomerForm() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

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

    const fullName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed User";

    await fetch("/api/onboarding/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerkId: user.id,
        name: fullName,
        email: user.primaryEmailAddress.emailAddress,
        phone,
        addresses: [address],
      }),
    });

    router.push("/onboarding/complete");
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
      <p className="text-sm text-gray-600 mb-4 cursor-pointer hover:underline"
         onClick={() => router.push("/onboarding/seller")}>
        Want to sign up as a seller instead?
      </p>

      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}

export default CustomerForm