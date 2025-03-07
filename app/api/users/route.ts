import User from "@/database/user.model";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    return error;
  }
}
