import { ProfileGrid } from "@/components/ProfileGrid";
import { ProfileStats } from "@/components/ProfileStats";
import { getCachedData, setCachedData } from "@/lib/cache";
import dbConnect from "@/lib/mongodb";
import Resource, { IResource } from "@/models/Resource";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  let resources: IResource[] = [];
  const stats = {
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  };

  try {
    const cacheKey = `profile:resources:${session.user.email}`;
    const cachedResources = await getCachedData<IResource[]>(cacheKey);

    if (cachedResources) {
      resources = cachedResources;
    } else {
      await dbConnect();
      
      const fetchedResources = await Resource.find({ 'addedBy.email': session.user.email })
        .sort({ createdAt: -1 })
        .lean();
        
      resources = JSON.parse(JSON.stringify(fetchedResources));
      await setCachedData(cacheKey, resources, 60);
    }
    
    stats.total = resources.length;
    stats.approved = resources.filter(r => r.status === 'approved').length;
    stats.pending = resources.filter(r => r.status === 'pending').length;
    stats.rejected = resources.filter(r => r.status === 'rejected').length;

  } catch (error) {
    console.error("Failed to load user resources. Is MongoDB/KV connected?", error);
  }

  return (
    <main className="flex-1 container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-mono font-bold tracking-tight mb-2 uppercase">My Profile</h1>
        <p className="text-muted-foreground">Manage your submitted directories and track their status.</p>
        
        <ProfileStats stats={stats} />
      </div>

      <div>
        <h2 className="text-xl font-mono font-bold tracking-tight mb-6 uppercase border-b border-border pb-4">My Submissions</h2>
        <ProfileGrid resources={resources} />
      </div>
    </main>
  );
}
