"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProductAddAction } from "@/lib/actions/product/ProductAddAction";

export default function productAdd(){

    const {user} = useUser();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        tags: "",
    })

    const [selectedFiles, setSelectedFiles] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async() =>{
        if (!user) return alert("User not loaded");
        console.log("Submitting form…", form);

        if(selectedFiles.length === 0){
            return alert("Please select at least one image.");
        }
        
        try{
            setLoading(true);


            const formData = new FormData();
            selectedFiles.forEach((file) => formData.append("files", file))

            const uploadRes = await fetch("/api/upload-imagekit", {
                method: "POST",
                body: formData,
            });
            if(!uploadRes.ok){
                throw new Error("Image upload failed");
            }

            const {images} = await uploadRes.json();
            console.log("Images uploaded: ", images);


            const res = await ProductAddAction({
                name: form.name,
                description: form.description,
                images: images,
                price: Number(form.price),
                stock: Number(form.stock),
                category: form.category,
                tags: form.tags.split(",").map((t) => t.trim()),
            })

            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to create product");
            }

            const data = await res.json();
            console.log("Product Created and added: ", data)
            alert('Product Added');

            setForm({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
                tags: "",
            });
            setSelectedFiles([]);
        } catch(error){
            console.log("Error while adding the product | ProductAdd component: ", error)
        } finally{
            setLoading(false);
        }
    }

    return(
        <Card className="max-w-lg w-full p-3">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Product Name</label>
                    <Input 
                        required
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <Textarea
                        required
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Price (in CAD)</label>
                    <Input
                        required
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                    />
                </div>     
                <div>
                    <label className="block text-sm font-medium">Stock</label>
                    <Input
                        required
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Category</label>
                    <Input
                        required
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Tags (comma separated)</label>
                    <Input
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Image URLs (comma separated)</label>
                    <Input
                        type="file"
                        accept="image/*"
                        multiple
                        // value={form.imagesURL}
                        onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                    />
                </div>
                <Button onClick={handleSubmit} disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Add Product"}
                </Button>
            </CardContent>
        </Card>
    )
}