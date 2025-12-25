import mongoose from "mongoose";
import { type } from "os";

const ProductSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        // images:[{
        //     url: {type: String, required: true},
        //     fileId: {type: String, required: true}
        // }],
        images: {
            type: [{
                url: { type: String, required: true },
                fileId: { type: String, required: true }
            }],
            validate: {
                validator: v => v.length > 0,
                message: "Product must have at least one image"
            }
        },

        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        },
        category: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
    },
    {timestamps: true}
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);