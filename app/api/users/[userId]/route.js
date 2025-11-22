import { DBConnect } from "@/lib/DBConnect";
import User from "@/models/User.model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await DBConnect();

    const IniParams = await params
    const userId = await IniParams.userId;

    const user = await User.findOne({ clerkId: userId }).select("+clerkId");
    console.log("Returning user from User Route:", user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req, {params}){
  try{
    await DBConnect();
    const IniParams = await params

    const clerkId = IniParams.userId;
    const body = await req.json();

    console.log("Patch request for Clerk ID: ", clerkId);
    console.log("Patch Body: ", body);

    const updated = await User.findOneAndUpdate(
      {clerkId},
      {$set: body},
      {new: true, runValidators: true}
    );
    if(!updated){
      return NextResponse.json({error: "User not found"}, {status: 404})
    }

    console.log("Update is pushed through the Route")
    return NextResponse.json(updated, {status: 200});
  } catch(error){
    console.error("Patch Error: ", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500})
  }
}
