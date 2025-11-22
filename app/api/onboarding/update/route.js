import { DBConnect } from "@/lib/DBConnect";
import User from "@/models/User.model";

export async function POST(req) {
  try {
    await DBConnect();

    const body = await req.json();
    const { clerkId, ...rest } = body;

    const updated = await User.findOneAndUpdate(
      { clerkId },
      { $set: rest },
      { new: true, upsert: true }
    );
    console.log(`Onboarding API success`)
    return Response.json({ success: true, user: updated });
  } catch (error) {
    console.error(`Onboarding API error: ${error}`)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
