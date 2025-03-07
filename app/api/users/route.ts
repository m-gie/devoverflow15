import User from "@/database/user.model";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);
    if (!validatedData.success) {
      throw new Error("Validation Error");
    }
    const { email, username } = validatedData.data;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");
    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error("Username already exists");
    const newUser = await User.create(validatedData.data);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    // console.error("Error ", error);
    console.log(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
