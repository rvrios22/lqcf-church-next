import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import jwt from "jsonwebtoken";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const token = request.headers.get("Authorization")?.split(" ")[1];

    const title = formData.get("title") as string;
    const file = formData.get("pdf") as File;
    const dateString = formData.get("date") as string;
    let studyId = formData.get("studyId") as string;
    const newStudyName = formData.get("newStudyName") as string;
    const dateUnix = dateString ? new Date(dateString).getTime() : Date.now();

    // 1. JWT Validation
    if (!token || !process.env.JWT_SECRET)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
    }

    // 2. Logic: Create Study if it doesn't exist
    if (!studyId && newStudyName) {
      studyId = await convex.mutation(api.studies.create, {
        title: newStudyName,
      });
    }

    if (!studyId)
      return NextResponse.json({ error: "No study provided" }, { status: 400 });

    // 3. Handle PDF Binary
    const uploadUrl = await convex.mutation(api.pdfs.generateUploadUrl);
    const postResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await postResponse.json();

    // 4. Link PDF to Study
    await convex.mutation(api.pdfs.savePdfRecord, {
      title,
      storageId,
      studyId: studyId as any,
      date: dateUnix,
    });

    return NextResponse.json({ success: true, studyCreated: !!newStudyName });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
