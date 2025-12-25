"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions/profile/action";
import { toast } from "sonner";


export default function PersonalInformation({ userData, setUserData }) {
  const [editable, setEditable] = useState(false);
  const [form, setForm] = useState(userData);
  const [loading, setLoading] = useState(false);
  

  const { name, email, phone, addresses, role, sellerProfile } = form;

  // Save function
const handleSave = async () => {
  try {
    setLoading(true);

    const result = await updateProfile(form);

    setForm(result.user);
    setEditable(false);

    toast.success("Profile updated successfully");
  } catch (err) {
    console.error("Update profile error:", err);

    if (err?.message === "AUTH_REQUIRED") {
      toast.error("Please sign in to update your profile");
      return;
    }

    if (err?.message === "USER_NOT_FOUND") {
      toast.error("User account not found");
      return;
    }

    toast.error("Failed to update profile. Please try again.");
  } finally {
    setLoading(false);
  }
};


  // Helper: render an address object
  const renderAddressFields = (addr, idx, path = "addresses") => (
    <div key={idx} className="space-y-1 border p-2 rounded">
      <label className="text-sm font-medium">
        {path === "sellerProfile.businessAddress" ? "Business Address" : `Address ${idx + 1}`}
      </label>
      <Input
        value={addr.label}
        disabled={!editable}
        placeholder="Label"
        onChange={(e) => {
          const updatedAddr = { ...addr, label: e.target.value };
          if (path === "addresses") {
            const newAddresses = [...addresses];
            newAddresses[idx] = updatedAddr;
            setForm({ ...form, addresses: newAddresses });
          } else {
            setForm({ ...form, sellerProfile: { ...sellerProfile, businessAddress: updatedAddr } });
          }
        }}
      />
      <Input
        value={addr.streetAddress}
        disabled={!editable}
        placeholder="Street Address"
        onChange={(e) => {
          const updatedAddr = { ...addr, streetAddress: e.target.value };
          if (path === "addresses") {
            const newAddresses = [...addresses];
            newAddresses[idx] = updatedAddr;
            setForm({ ...form, addresses: newAddresses });
          } else {
            setForm({ ...form, sellerProfile: { ...sellerProfile, businessAddress: updatedAddr } });
          }
        }}
      />
      <Input
        value={addr.city}
        disabled={!editable}
        placeholder="City"
        onChange={(e) => {
          const updatedAddr = { ...addr, city: e.target.value };
          if (path === "addresses") {
            const newAddresses = [...addresses];
            newAddresses[idx] = updatedAddr;
            setForm({ ...form, addresses: newAddresses });
          } else {
            setForm({ ...form, sellerProfile: { ...sellerProfile, businessAddress: updatedAddr } });
          }
        }}
      />
      <Input
        value={addr.postalCode}
        disabled={!editable}
        placeholder="Postal Code"
        onChange={(e) => {
          const updatedAddr = { ...addr, postalCode: e.target.value };
          if (path === "addresses") {
            const newAddresses = [...addresses];
            newAddresses[idx] = updatedAddr;
            setForm({ ...form, addresses: newAddresses });
          } else {
            setForm({ ...form, sellerProfile: { ...sellerProfile, businessAddress: updatedAddr } });
          }
        }}
      />
      <Input
        value={addr.country}
        disabled={!editable}
        placeholder="Country"
        onChange={(e) => {
          const updatedAddr = { ...addr, country: e.target.value };
          if (path === "addresses") {
            const newAddresses = [...addresses];
            newAddresses[idx] = updatedAddr;
            setForm({ ...form, addresses: newAddresses });
          } else {
            setForm({ ...form, sellerProfile: { ...sellerProfile, businessAddress: updatedAddr } });
          }
        }}
      />
    </div>
  );

  return (
    <div className="w-full max-w-lg space-y-4 mt-6 p-5 border rounded-xl">
      <h2 className="text-xl font-semibold">Your Personal Information</h2>

      {/* Basic Info */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={name}
          disabled={!editable}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <Input value={email} disabled />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Phone</label>
        <Input
          value={phone || ""}
          disabled={!editable}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      {/* Conditional rendering based on role */}
      {role === "user" &&
        (addresses.length > 0
          ? addresses.map((addr, idx) => renderAddressFields(addr, idx))
          : <p>No addresses added yet.</p>)
      }

      {role === "seller" && (
        <>
          <div className="space-y-1">
            <label className="text-sm font-medium">Business Name</label>
            <Input
              value={sellerProfile.businessName || ""}
              disabled={!editable}
              onChange={(e) => setForm({ ...form, sellerProfile: { ...sellerProfile, businessName: e.target.value } })}
            />
          </div>

          {sellerProfile.businessAddress &&
            renderAddressFields(sellerProfile.businessAddress, 0, "sellerProfile.businessAddress")}
        </>
      )}

      {/* Edit / Save Buttons */}
      {!editable && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full mt-4">Edit Profile</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Profile?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to edit your personal information?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setEditable(true)}>
                Yes, Edit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {editable && (
        <div className="flex gap-4 mt-4">
          <Button className="w-full" onClick={handleSave}>Save</Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setForm(userData);
              setEditable(false);
            }}
          >
            Discard
          </Button>
        </div>
      )}
    </div>
  );
}
