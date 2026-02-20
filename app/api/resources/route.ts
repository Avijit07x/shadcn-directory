import { fetchMetadata } from "@/lib/fetchMetadata";
import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    
    // Return all resources sorted by latest
    const resources = await Resource.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(resources);
  } catch (error: any) {
    console.error("GET /api/resources error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Check for duplicates
    const existingResource = await Resource.findOne({ url });
    if (existingResource) {
      return NextResponse.json(
        { error: "This URL has already been added to the directory" },
        { status: 409 }
      );
    }

    // Fetch Open Graph metadata
    const metadata = await fetchMetadata(url);

    // Save to database
    const newResource = await Resource.create({
      url,
      title: metadata.title,
      description: metadata.description,
      image: metadata.image,
      domain: metadata.domain,
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/resources error:", error);
    
    // Handle Mongoose duplicate key error specifically just in case
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "This URL has already been added to the directory" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save resource or fetch metadata" },
      { status: 500 }
    );
  }
}
