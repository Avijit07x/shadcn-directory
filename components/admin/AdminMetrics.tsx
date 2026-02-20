interface AdminMetricsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export function AdminMetrics({ stats }: AdminMetricsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
      <div className="border border-border p-6 bg-background relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-muted-foreground/30 transition-all group-hover:w-full group-hover:bg-muted/5 -z-10" />
        <div className="text-3xl font-mono font-bold">{stats.total}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-mono">Total Links</div>
      </div>
      <div className="border border-border p-6 bg-background relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/30 transition-all group-hover:w-full group-hover:bg-yellow-500/5 -z-10" />
        <div className="text-3xl font-mono font-bold">{stats.pending}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-mono">Pending</div>
      </div>
      <div className="border border-border p-6 bg-background relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500/30 transition-all group-hover:w-full group-hover:bg-green-500/5 -z-10" />
        <div className="text-3xl font-mono font-bold">{stats.approved}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-mono">Approved</div>
      </div>
      <div className="border border-border p-6 bg-background relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-500/30 transition-all group-hover:w-full group-hover:bg-red-500/5 -z-10" />
        <div className="text-3xl font-mono font-bold">{stats.rejected}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2 font-mono">Rejected</div>
      </div>
    </div>
  );
}
