import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import jwt from "jsonwebtoken";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function PUT(request: Request) {
  try {
    const { token, id, message, author, coramDeo } = await request.json();

    // 1. Verify the JWT
    const secret = process.env.JWT_SECRET;
    if (!secret)
      return NextResponse.json({ error: "Config error" }, { status: 500 });

    try {
      jwt.verify(token, secret);
    } catch (err) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Call the Convex Mutation directly from the server
    // Note: Standard mutations called via HttpClient on the server
    // run with admin privileges if they aren't protected by Convex Auth.
    await convex.mutation(api.pastorMessage.update, {
      id,
      message,
      author,
      coramDeo,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
