import { fetchMetadata } from "@/lib/fetchMetadata";
import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { NextResponse } from "next/server";

const DEFAULT_RESOURCES = [
  "https://magicui.design",
  "https://aceternity.com",
  "https://ui.shadcn.com",
  "https://shadcnblocks.com",
  "https://bundui.dev",
];

export async function GET() {
  try {
    await dbConnect();

    const results = [];
    let addedCount = 0;

    for (const url of DEFAULT_RESOURCES) {
      const exists = await Resource.findOne({ url });
      if (exists) {
        results.push({ url, status: "already exists" });
        continue;
      }

      try {
        const metadata = await fetchMetadata(url);
        await Resource.create({
          url,
          title: metadata.title,
          description: metadata.description,
          image: metadata.image,
          domain: metadata.domain,
        });
        results.push({ url, status: "added" });
        addedCount++;
      } catch (error: any) {
        results.push({ url, status: "failed", error: error.message });
      }
    }

    return NextResponse.json({
      message: `Seeding complete. Added ${addedCount} new resources.`,
      results,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to run seed script" },
      { status: 500 }
    );
  }
}
