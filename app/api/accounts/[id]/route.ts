import { User as Account } from "@/database";
import dbConnect from "@/lib/mongoose";
import { UserSchema as AccountSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { success: false, data: "No ID provided" },
      { status: 400 }
    );
  }
  try {
    await dbConnect();
    const account = await Account.findById(id);
    if (!account) {
      return NextResponse.json(
        { success: false, data: "Account not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { success: false, data: "No ID provided" },
      { status: 400 }
    );
  }
  try {
    await dbConnect();
    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      return NextResponse.json(
        { success: false, data: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { success: false, data: "No ID provided" },
      { status: 400 }
    );
  }
  try {
    await dbConnect();
    const body = await request.json();

    const validatedData = AccountSchema.partial().safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, data: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedAccount) {
      return NextResponse.json(
        { success: false, data: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
