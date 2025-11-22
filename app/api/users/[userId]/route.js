import { DBConnect } from "@/lib/DBConnect";
import User from "@/models/User.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await DBConnect();

    const IniParams = await params
    const userId = await IniParams.userId;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
