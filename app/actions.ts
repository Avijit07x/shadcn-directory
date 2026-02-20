"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchMetadata } from "@/lib/fetchMetadata";
import dbConnect from "@/lib/mongodb";
import { actionFallback, actionRatelimit, checkRateLimit } from "@/lib/rateLimit";
import Resource from "@/models/Resource";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function addResourceAction(url: string) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    
    const { success } = await checkRateLimit(ip, actionRatelimit, actionFallback, 5, 60000);
    
    if (!success) {
      return { error: "Too many requests. Please try again in a minute." };
    }
    const session = await getServerSession(authOptions);
    
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

    await Resource.create({
      url,
      title: metadata.title,
      description: metadata.description,
      image: metadata.image,
      domain: metadata.domain,
      addedBy: {
        name: session.user.name || "Unknown User",
        email: session.user.email || "",
        image: session.user.image || "",
      }
    });

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code?: number }).code === 11000) {
      return { error: "This URL has already been added to the directory" };
    }

    console.error("Failed to add resource:", error);
    return { error: "Failed to save resource or fetch metadata" };
  }
}
