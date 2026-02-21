"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRedisClient } from "@/lib/cache";
import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";

// Type guard for valid MongoDB ObjectIds
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.isAdmin;
}

export async function updateResourceStatus(id: string, status: string) {
  if (!(await checkAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  await Resource.findByIdAndUpdate(id, { status });
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteResourceItem(id: string) {
  if (!(await checkAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  await Resource.findByIdAndDelete(id);
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function bulkUpdateResourceStatus(ids: string[], status: string) {
  if (!(await checkAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  
  const mongoIds = ids.filter(isValidObjectId);
  const redisIds = ids.filter(id => !isValidObjectId(id));

  // Handle MongoDB items
  if (mongoIds.length > 0) {
    await Resource.updateMany({ _id: { $in: mongoIds } }, { status });
  }

  // Handle Redis items
  if (redisIds.length > 0) {
    const redis = await getRedisClient();
    const itemsRaw = await redis.lrange("resource_queue", 0, -1);
    
    // We only migrate to MongoDB if status is "approved".
    // If status is "rejected" or anything else, we just delete from queue.
    for (const itemStr of itemsRaw) {
      try {
        const item = JSON.parse(itemStr);
        if (redisIds.includes(item.id)) {
          if (status === "approved") {
            const { id: _removedId, ...dbResourceData } = item;
            const existingResource = await Resource.findOne({ url: item.url });
            
            if (!existingResource) {
              await Resource.create({ ...dbResourceData, status });
            }
          }
          await redis.lrem("resource_queue", 1, itemStr);
        }
      } catch {
        continue;
      }
    }
    await redis.del("resources:page-1:limit-12:search-all");
  }
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function bulkDeleteResources(ids: string[]) {
  if (!(await checkAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  
  const mongoIds = ids.filter(isValidObjectId);
  const redisIds = ids.filter(id => !isValidObjectId(id));

  // Delete from MongoDB
  if (mongoIds.length > 0) {
    await Resource.deleteMany({ _id: { $in: mongoIds } });
  }

  // Delete from Redis (Reject completely)
  if (redisIds.length > 0) {
    const redis = await getRedisClient();
    const itemsRaw = await redis.lrange("resource_queue", 0, -1);
    
    for (const itemStr of itemsRaw) {
      try {
        const item = JSON.parse(itemStr);
        if (redisIds.includes(item.id)) {
          await redis.lrem("resource_queue", 1, itemStr);
        }
      } catch {
        continue;
      }
    }
  }
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
