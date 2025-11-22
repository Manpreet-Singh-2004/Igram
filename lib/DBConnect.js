import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

export const DBConnect = async () => {
  if (!MONGO_URI) throw new Error("MONGO_URI is not present in env");

  const readyState = mongoose.connection.readyState;

  if (readyState === 1) {
    console.log("DB already connected");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    console.log("Mongo connection failed:", error);
  }
};
