import Account from "@/database/account.model";
import dbConnect from "@/lib/mongoose";
import { UserSchema as AccountSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();
  try {
    await dbConnect();
    const validatedData = AccountSchema.partial().safeParse({
      providerAccountId,
    });
    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, data: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const account = await Account.findOne({ providerAccountId });

    if (!account) {
      throw new Error("Account not found", providerAccountId);
    }

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
