import { getRedisClient } from "@/lib/cache";
import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const batchSize = 50;
    const resources: any[] = [];
    const redis = await getRedisClient();

    for (let i = 0; i < batchSize; i++) {
      const itemStr = await redis.rpop("resource_queue");
      if (!itemStr) break; 
      
      try {
        const item = JSON.parse(itemStr);
        resources.push(item);
      } catch (e) {
        console.error("Failed to parse queue item:", e);
      }
    }

    if (resources.length > 0) {
      await dbConnect();

      const urls = resources.map((r: { url?: string }) => r.url).filter(Boolean);
      const existingResources = await Resource.find({ url: { $in: urls } }).select("url").lean();
      const existingUrls = existingResources.map(r => r.url);

      const newResources = resources.filter((r: { url?: string }) => r.url && !existingUrls.includes(r.url));

      if (newResources.length > 0) {
        await Resource.insertMany(newResources, { ordered: false });
        await redis.del("resources:page-1:limit-12:search-all");
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: resources.length 
    });

  } catch (error) {
    console.error("Queue processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
