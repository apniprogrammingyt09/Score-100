import { NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase_admin";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const productId = searchParams.get("productId");
    const uid = searchParams.get("uid");

    if (!orderId || !productId || !uid) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Verify the order exists and belongs to the user
    const orderDoc = await adminDB.doc(`orders/${orderId}`).get();

    if (!orderDoc.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = orderDoc.data();

    // Verify the order belongs to the user
    if (order.uid !== uid) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Verify order is not cancelled (order exists means payment was successful)
    if (order.status === "cancelled") {
      return NextResponse.json(
        { error: "Order was cancelled" },
        { status: 403 }
      );
    }

    // Find the eBook in the order
    const lineItem = order.checkout?.line_items?.find(
      (item) => item.productId === productId && item.format === "ebook"
    );

    if (!lineItem || !lineItem.ebookUrl) {
      return NextResponse.json(
        { error: "eBook not found in this order" },
        { status: 404 }
      );
    }

    const ebookUrl = lineItem.ebookUrl;

    // Check if it's an internal file (stored on our server)
    if (ebookUrl.startsWith("/ebooks/") || ebookUrl.startsWith("/protected-ebooks/")) {
      // Internal file - serve it directly
      const filename = ebookUrl.split("/").pop();
      
      // Try protected folder first, then public ebooks folder
      let filepath = path.join(process.cwd(), "protected-ebooks", filename);
      let fileBuffer;
      
      try {
        fileBuffer = await readFile(filepath);
      } catch (e) {
        // Try public ebooks folder as fallback
        filepath = path.join(process.cwd(), "public", "ebooks", filename);
        try {
          fileBuffer = await readFile(filepath);
        } catch (e2) {
          return NextResponse.json(
            { error: "eBook file not found on server" },
            { status: 404 }
          );
        }
      }

      // Create download response
      const response = new NextResponse(fileBuffer);
      response.headers.set("Content-Type", "application/pdf");
      response.headers.set(
        "Content-Disposition",
        `attachment; filename="${lineItem.name?.replace(/[^a-zA-Z0-9\s]/g, "") || "ebook"}.pdf"`
      );
      response.headers.set("Content-Length", fileBuffer.length.toString());
      
      return response;
    } else {
      // External URL (Google Drive, etc.) - redirect to it
      return NextResponse.redirect(ebookUrl);
    }
  } catch (error) {
    console.error("Secure download error:", error);
    return NextResponse.json(
      { error: "Failed to download eBook" },
      { status: 500 }
    );
  }
}
