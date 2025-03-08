import { User } from "@/database";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
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
    const user = await User.findById(id);
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
    const user = await User.findByIdAndDelete(id);
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

    const validatedData = UserSchema.partial().parse(body);

    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, data: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
