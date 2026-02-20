import { ResourceCard } from "@/components/ResourceCard";
import { IResource } from "@/models/Resource";

interface ProfileGridProps {
  resources: IResource[];
}

export function ProfileGrid({ resources }: ProfileGridProps) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-border p-12">
        <div className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          [ No Submissions ]
        </div>
        <p className="text-muted-foreground max-w-sm font-mono text-xs uppercase tracking-wider">
          You haven&apos;t submitted any resources yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-border">
      {resources.map((resource) => (
        <div key={String(resource._id)} className="relative group">
          <ResourceCard resource={resource} />
          
          {resource.status === 'pending' && (
            <div className="absolute top-2 right-2 bg-yellow-500/90 text-yellow-950 text-[10px] font-mono font-bold px-2 py-1 z-10 uppercase tracking-widest pointer-events-none">
              Pending
            </div>
          )}
          {resource.status === 'rejected' && (
            <div className="absolute top-2 right-2 bg-red-500/90 text-white text-[10px] font-mono font-bold px-2 py-1 z-10 uppercase tracking-widest pointer-events-none">
              Rejected
            </div>
          )}
          {resource.status === 'approved' && (
            <div className="absolute top-2 right-2 bg-green-500/90 text-white text-[10px] font-mono font-bold px-2 py-1 z-10 uppercase tracking-widest pointer-events-none">
              Approved
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
