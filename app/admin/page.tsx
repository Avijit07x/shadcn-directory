import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AdminMetrics } from "@/components/admin/AdminMetrics";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminTabs } from "@/components/admin/AdminTabs";
import dbConnect from "@/lib/mongodb";
import Resource, { IResource } from "@/models/Resource";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Panel",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboard(props: PageProps) {
  const [session, searchParams] = await Promise.all([
    getServerSession(authOptions),
    props.searchParams,
  ]);
  
  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : 'all';
  const limit = 20;
  const skip = (page - 1) * limit;

  await dbConnect();

  const query: Record<string, any> = {};
  if (statusFilter !== 'all') {
    query.status = statusFilter;
  }

  const { getRedisClient } = await import("@/lib/cache");

  const [statusCounts, fetchedResources, totalFiltered, redis] = await Promise.all([
    Resource.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    Resource.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Resource.countDocuments(query),
    getRedisClient(),
  ]);

  const stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
  for (const { _id, count } of statusCounts) {
    if (_id in stats) stats[_id as keyof typeof stats] = count;
    stats.total += count;
  }

  let resources = JSON.parse(JSON.stringify(fetchedResources)) as IResource[];
  let totalPages = Math.ceil(totalFiltered / limit) || 1;

  const queueItems = await redis.lrange("resource_queue", 0, -1);
  const parsedQueueItems: IResource[] = queueItems.map(itemStr => {
    try {
      const item = JSON.parse(itemStr);
      return {
        _id: item.id,
        ...item,
        status: "pending",
      } as IResource;
    } catch {
      return null;
    }
  }).filter(Boolean) as IResource[];

  stats.pending += parsedQueueItems.length;
  stats.total += parsedQueueItems.length;

  if (statusFilter === 'all' || statusFilter === 'pending') {
    if (page === 1) {
      resources = [...parsedQueueItems, ...resources].slice(0, limit);
    }
    totalPages = Math.ceil((totalFiltered + parsedQueueItems.length) / limit) || 1;
  }

  const tabs = [
    { name: 'All', value: 'all' },
    { name: 'Pending', value: 'pending', count: stats.pending },
    { name: 'Approved', value: 'approved' },
    { name: 'Rejected', value: 'rejected' },
  ];

  return (
  <div className="w-full">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-6 pt-8 sm:pt-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-border pb-8 w-full">
        <div>
          <div className="flex items-center gap-3 mb-2">
            
            <h1 className="text-3xl font-mono font-bold tracking-tight uppercase">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
             {"//"} Manage network submissions and approvals
          </p>
        </div>
      </div>

      <AdminMetrics stats={stats} />

      <div className="border border-border bg-background shadow-sm">
        <AdminTabs statusFilter={statusFilter} tabs={tabs} />
        <AdminTable resources={resources} page={page} totalPages={totalPages} statusFilter={statusFilter} />
      </div>
    </div>
  </div>
  );
}
