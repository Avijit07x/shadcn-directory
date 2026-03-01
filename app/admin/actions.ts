"use server";

import { auth } from "@/lib/auth";
import { getRedisClient } from "@/lib/cache";
import { sendApprovalEmail } from "@/lib/email";
import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const isValidObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

async function checkAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.role === "admin";
}

export async function updateResourceStatus(id: string, status: string) {
  if (!(await checkAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  
  if (isValidObjectId(id)) {
    if (status === "approved") {
      const resource = await Resource.findByIdAndUpdate(id, { status }, { new: false });
      if (resource && resource.addedBy?.email && resource.status !== "approved") {
        await sendApprovalEmail(resource.addedBy.email, resource.title || resource.url, resource.url).catch(console.error);
      }
    } else {
      await Resource.findByIdAndUpdate(id, { status });
    }
  } else {
    const redis = await getRedisClient();
    const itemsRaw = await redis.lrange("resource_queue", 0, -1);
    
    for (const itemStr of itemsRaw) {
      try {
        const item = JSON.parse(itemStr);
        if (item.id === id) {
          if (status === "approved") {
            const { id: _removedId, ...dbResourceData } = item;
            const existingResource = await Resource.findOne({ url: item.url });
            
            if (!existingResource) {
              await Resource.create({ ...dbResourceData, status });
              
              if (item.addedBy?.email) {
                await sendApprovalEmail(item.addedBy.email, item.title || item.url, item.url).catch(console.error);
              }
            }
          }
          await redis.lrem("resource_queue", 1, itemStr);
          break;
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

export async function deleteResourceItem(id: string) {
  if (!(await checkAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  
  if (isValidObjectId(id)) {
    await Resource.findByIdAndDelete(id);
  } else {
    const redis = await getRedisClient();
    const itemsRaw = await redis.lrange("resource_queue", 0, -1);
    
    for (const itemStr of itemsRaw) {
      try {
        const item = JSON.parse(itemStr);
        if (item.id === id) {
          await redis.lrem("resource_queue", 1, itemStr);
          break;
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

export async function bulkUpdateResourceStatus(ids: string[], status: string) {
  if (!(await checkAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  
  const mongoIds = ids.filter(isValidObjectId);
  const redisIds = ids.filter(id => !isValidObjectId(id));

  if (mongoIds.length > 0) {
    if (status === "approved") {
      // Find them first to get their emails before they are updated
      const resourcesToApprove = await Resource.find({ _id: { $in: mongoIds }, status: { $ne: "approved" } });
      await Resource.updateMany({ _id: { $in: mongoIds } }, { status });
      
      // Fire off emails for all newly approved resources
      await Promise.all(resourcesToApprove.map(async (resource) => {
        if (resource.addedBy?.email) {
          await sendApprovalEmail(resource.addedBy.email, resource.title || resource.url, resource.url).catch(console.error);
        }
      }));
    } else {
      await Resource.updateMany({ _id: { $in: mongoIds } }, { status });
    }
  }

  if (redisIds.length > 0) {
    const redis = await getRedisClient();
    const itemsRaw = await redis.lrange("resource_queue", 0, -1);
    
    for (const itemStr of itemsRaw) {
      try {
        const item = JSON.parse(itemStr);
        if (redisIds.includes(item.id)) {
          if (status === "approved") {
            const { id: _removedId, ...dbResourceData } = item;
            const existingResource = await Resource.findOne({ url: item.url });
            
            if (!existingResource) {
              await Resource.create({ ...dbResourceData, status });
              
              if (item.addedBy?.email) {
                await sendApprovalEmail(item.addedBy.email, item.title || item.url, item.url).catch(console.error);
              }
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

  if (mongoIds.length > 0) {
    await Resource.deleteMany({ _id: { $in: mongoIds } });
  }

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
