"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";

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
  await Resource.updateMany({ _id: { $in: ids } }, { status });
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function bulkDeleteResources(ids: string[]) {
  if (!(await checkAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  await Resource.deleteMany({ _id: { $in: ids } });
  
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}
