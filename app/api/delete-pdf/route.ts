import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import jwt from "jsonwebtoken";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function DELETE(request: Request) {
  try {
    const { token, id, storageId } = await request.json();

    // 1. Verify Admin JWT
    const secret = process.env.JWT_SECRET;
    if (!token || !secret)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      jwt.verify(token, secret);
    } catch (err) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }

    // 2. Call the Convex Mutation
    await convex.mutation(api.pdfs.remove, { id, storageId });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
