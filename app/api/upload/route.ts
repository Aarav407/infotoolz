import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { importProductFromFile } from "@/lib/import-product";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const results = [];

    for (const entry of files) {
      if (!(entry instanceof File)) continue;

      const buffer = Buffer.from(await entry.arrayBuffer());
      const result = importProductFromFile(entry.name, buffer);
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      products: results,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
