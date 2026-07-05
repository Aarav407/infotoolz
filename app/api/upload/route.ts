import { NextRequest, NextResponse } from "next/server";
import { importProductFromFile } from "@/lib/import-product";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");
    const categorySlug = formData.get("categorySlug")?.toString();

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const results = [];

    for (const entry of files) {
      if (!(entry instanceof File)) continue;

      const buffer = Buffer.from(await entry.arrayBuffer());
      const result = importProductFromFile(entry.name, buffer, { categorySlug });
      results.push(result);
    }

    if (!results.length) {
      return NextResponse.json(
        { error: "No valid image files were uploaded. Please choose PNG, JPG, or WebP photos." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      products: results,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error:
          "Upload failed. Please run this from the local dev server; live deployments may not allow saving files.",
      },
      { status: 500 }
    );
  }
}
