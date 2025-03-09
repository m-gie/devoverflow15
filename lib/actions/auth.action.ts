"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import User from "@/database/user.model";

import action from "../handlers/action";

import { SignInSchema, SignUpSchema } from "../validations";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    throw new Error(validationResult.message);
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    const existingUsername = await User.findOne({ username }).session(session);

    if (existingUsername) {
      throw new Error("Username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create([{ username, name, email }], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    await session.abortTransaction();

    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  } finally {
    await session.endSession();
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });

  if (validationResult instanceof Error) {
    throw new Error(validationResult.message);
  }

  const { email, password } = validationResult.params!;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new Error("User does not exist");

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });

    if (!existingAccount) throw new Error("Account does not exist");

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password
    );

    if (!passwordMatch) throw new Error("Password does not match");

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
}
