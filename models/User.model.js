import mongoose from "mongoose"

const AddressSchema = new mongoose.Schema({
    label: {type: String, default: "Home"},
    country: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: String, required: true},
    streetAddress: {type: String, required: true}
});

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        clerkId: {
            type: String,
            required: true,
            unique: true,
            select: false,
        },
        phone: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "seller", "admin"],
            default: "user",
        },
        addresses: {
            type: [AddressSchema],
            default: [],
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        sellerProfile: {
            businessName: String,
            businessAddress: AddressSchema,
        },
    },
    {timestamps: true}
);

export default mongoose.models.User || mongoose.model("User", UserSchema)