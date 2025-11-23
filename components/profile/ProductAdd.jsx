"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function productAdd(){

    const {user} = useUser();

    const [form, setForm] = useState({
        name: "",
        description: "",
        imagesURL: "",
        price: "",
        stock: "",
        category: "",
        tags: "",
    })

    const [loading, setLoading] = useState(false);

    const handleSubmit = async() =>{
        if (!user) return alert("User not loaded");
        console.log("Submitting form…", form);
        
        try{
            setLoading(true);


            const formData = new FormData();
            form.imagesURL.forEach((file) => formData.append("files", file));

            const uploadRes = await fetch("/api/upload-imagekit", {
                method: "POST",
                body: formData,
            });
            const {urls} = await uploadRes.json();

            console.log("Url Created | HandleSubmit")


            const res = await fetch("/api/products", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    clerkId: user.id,
                    name: form.name,
                    description: form.description,
                    imagesURL: urls,
                    price: Number(form.price),
                    stock: Number(form.stock),
                    category: form.category,
                    tags: form.tags.split(",").map((t) => t.trim()),
                }),
            });

            const data = await res.json();
            console.log("Product Created and added: ", data)
            alert('Product Added');

            setForm({
                name: "",
                description: "",
                imagesURL: "",
                price: "",
                stock: "",
                category: "",
                tags: "",
            })
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
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <Textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Price (in CAD)</label>
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
                        onChange={(e) => setForm({ ...form, imagesURL: Array.from(e.target.files) })}
                    />
                </div>
                <Button onClick={handleSubmit} disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Add Product"}
                </Button>
            </CardContent>
        </Card>
    )
}