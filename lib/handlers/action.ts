"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import { ZodError, ZodSchema } from "zod";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, data: error.flatten().fieldErrors };
      } else {
        throw error;
      }
    }
  }
  let session: Session | null = null;
  if (authorize) {
    session = await auth();
    if (!session) {
      return { success: false, data: "Unauthorized" };
    }
  }
  await dbConnect();

  return { params, session };
}

export default action;
