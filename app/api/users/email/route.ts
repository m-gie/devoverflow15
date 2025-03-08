import User from "@/database/user.model";
import { UserSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    const validatedData = UserSchema.partial().safeParse({ email });
    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, data: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, data: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
