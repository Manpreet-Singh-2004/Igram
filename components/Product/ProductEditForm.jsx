"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { editProductAction } from "@/lib/actions/product/ProductEdit";

export default function ProductEdit({ product }) {
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    stock: product.stock || "",
    category: product.category || "",
    tags: product.tags?.join(", ") || "",
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let finalImages = product.images;

      // Upload new images if selected
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        const uploadRes = await fetch("/api/upload-imagekit", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("IMAGE_UPLOAD_FAILED");
        }

        const { images } = await uploadRes.json();
        finalImages = images;
      }

      await editProductAction(product._id, {
        name: form.name,
        description: form.description,
        images: finalImages,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()),
      });

      toast.success("Product updated successfully");
    } catch (err) {
      console.error("Edit product error:", err);

      if (err?.message === "AUTH_REQUIRED") {
        toast.error("Please sign in to edit this product");
        return;
      }

      if (err?.message === "NOT_SELLER") {
        toast.error("You are not allowed to edit this product");
        return;
      }

      if (err?.message === "IMAGE_UPLOAD_FAILED") {
        toast.error("Failed to upload images");
        return;
      }

      toast.error("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg w-full p-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price (CAD)</label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Stock</label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <Input
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Tags (comma separated)
          </label>
          <Input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Replace Images (optional)
          </label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setSelectedFiles(Array.from(e.target.files || []))
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to keep existing images.
          </p>
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Update Product"}
        </Button>
      </CardContent>
    </Card>
  );
}
