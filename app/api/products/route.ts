import { NextRequest, NextResponse } from "next/server";
import {
  deleteProduct,
  getEditableProducts,
  restoreProductsFromPhotos,
  updateProductName,
} from "@/lib/import-product";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json({ products: getEditableProducts() });
  } catch (error) {
    console.error("Products load error:", error);
    return NextResponse.json(
      { error: "Could not load products." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = typeof body.action === "string" ? body.action : "";
    const categorySlug =
      typeof body.categorySlug === "string" ? body.categorySlug : undefined;

    if (action !== "restore") {
      return NextResponse.json(
        { error: "Unsupported action." },
        { status: 400 }
      );
    }

    const result = restoreProductsFromPhotos({ categorySlug });
    return NextResponse.json({
      ...result,
      productsList: getEditableProducts(),
    });
  } catch (error) {
    console.error("Product restore error:", error);
    const message = error instanceof Error ? error.message : "Could not restore products.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = typeof body.slug === "string" ? body.slug : "";
    const name = typeof body.name === "string" ? body.name : "";
    const fillSpecs = Boolean(body.fillSpecs);

    if (!slug || !name.trim()) {
      return NextResponse.json(
        { error: "Product and name are required." },
        { status: 400 }
      );
    }

    const product = updateProductName(slug, name, { fillSpecs });
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product update error:", error);
    const message = error instanceof Error ? error.message : "Could not update product.";
    const status = message.startsWith("Could not detect specs") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = typeof body.slug === "string" ? body.slug : "";

    if (!slug) {
      return NextResponse.json(
        { error: "Product is required." },
        { status: 400 }
      );
    }

    const product = deleteProduct(slug);
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Product delete error:", error);
    const message = error instanceof Error ? error.message : "Could not delete product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
