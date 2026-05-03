import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import jwt from "jsonwebtoken";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const { token, id, title, description, date } = await request.json();

    // 1. JWT Validation
    if (!token || !process.env.JWT_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }

    // 2. Convert date string to Unix timestamp
    const dateUnix = new Date(date).getTime();

    // 3. Execute Update
    await convex.mutation(api.monthEvents.update, {
      id,
      title,
      description,
      date: dateUnix,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Edit Event Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
