import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Generate unique ID without external dependency
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const productId = formData.get("productId");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type (only PDF allowed)
    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Max file size: 50MB
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueId = generateUniqueId();
    const filename = `ebook_${productId || "unknown"}_${uniqueId}.pdf`;
    
    // Store in protected-ebooks folder (NOT public - requires API to access)
    const ebooksDir = path.join(process.cwd(), "protected-ebooks");
    try {
      await mkdir(ebooksDir, { recursive: true });
    } catch (e) {
      // Directory might already exist
    }

    const filepath = path.join(ebooksDir, filename);
    await writeFile(filepath, buffer);

    // Return the internal path (will be served via secure download API)
    const fileUrl = `/protected-ebooks/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: filename,
    });
  } catch (error) {
    console.error("eBook upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload eBook" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
