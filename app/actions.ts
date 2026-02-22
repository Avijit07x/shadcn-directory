"use server";

import { auth } from "@/lib/auth";
import { fetchMetadata } from "@/lib/fetchMetadata";
import dbConnect from "@/lib/mongodb";
import { actionFallback, checkRateLimit } from "@/lib/rateLimit";
import Resource from "@/models/Resource";
import { headers } from "next/headers";

export async function addResourceAction(url: string) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    
    const { success } = await checkRateLimit(ip, actionFallback, 5, 60000);
    
    if (!success) {
      return { error: "Too many requests. Please try again in a minute." };
    }
    const session = await auth.api.getSession({ headers: headersList });
    
    if (!session || !session.user) {
      return { error: "Unauthorized. Please sign in to add a resource." };
    }

    await dbConnect();
    
    if (!url) {
      return { error: "URL is required" };
    }

    try {
      new URL(url);
    } catch {
      return { error: "Invalid URL format" };
    }

    const existingResource = await Resource.findOne({ url });
    if (existingResource) {
      return { error: "This URL has already been added to the directory" };
    }

    const metadata = await fetchMetadata(url);

    const resourceData = {
      url,
      title: metadata.title,
      description: metadata.description,
      image: metadata.image,
      domain: metadata.domain,
      status: "pending",
      addedBy: {
        name: session.user.name || "Unknown User",
        email: session.user.email || "",
        image: session.user.image || "",
      },
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID()
    };

    const { getRedisClient } = await import("@/lib/cache");
    const redis = await getRedisClient();
    await redis.lpush("resource_queue", JSON.stringify(resourceData));

    return { success: true, message: "Resource queued for addition." };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: number }).code === 11000) {
      return { error: "This URL has already been added to the directory" };
    }

    console.error("Failed to add resource:", error);
    return { error: "Failed to save resource or fetch metadata" };
  }
}
