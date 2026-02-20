export interface ProfileStatsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      <div className="border border-border p-4 bg-muted/20">
        <div className="text-2xl font-mono font-bold">{stats.total}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Total Submissions</div>
      </div>
      <div className="border border-border p-4 bg-muted/20">
        <div className="text-2xl font-mono font-bold text-green-500">{stats.approved}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Approved</div>
      </div>
      <div className="border border-border p-4 bg-muted/20">
        <div className="text-2xl font-mono font-bold text-yellow-500">{stats.pending}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Pending</div>
      </div>
      <div className="border border-border p-4 bg-muted/20">
        <div className="text-2xl font-mono font-bold text-red-500">{stats.rejected}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Rejected</div>
      </div>
    </div>
  );
}
