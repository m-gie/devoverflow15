import { Account } from "@/database";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const accounts = await Account.find({});
    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = AccountSchema.parse(body);
    const existingAccount = await Account.findOne({
      provider: validatedData.provider,
      providerAccountId: validatedData.providerAccountId,
    });
    if (existingAccount) throw new Error("Account already exists");
    const newAccount = await Account.create(validatedData);

    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error ", error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
