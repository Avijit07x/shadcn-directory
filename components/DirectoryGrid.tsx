import { ResourceCard } from "@/components/ResourceCard";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { IResource } from "@/models/Resource";
import { SearchX } from "lucide-react";

interface DirectoryGridProps {
  resources: IResource[];
  page: number;
  totalPages: number;
  limit: number;
  searchQuery: string;
  totalResources?: number;
}

export function DirectoryGrid({ resources, page, totalPages, limit, searchQuery, totalResources }: DirectoryGridProps) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 border border-dashed border-border p-12">
        <div className="flex h-16 w-16 items-center justify-center border border-border bg-muted/30">
          <SearchX className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <div className="space-y-2">
          <div className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            [ Empty Directory ]
          </div>
          <p className="text-muted-foreground max-w-sm font-mono text-xs uppercase tracking-wider">
            {searchQuery 
              ? `No matches for "${searchQuery}"` 
              : "No resources found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-1.5 bg-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {searchQuery ? `Results for "${searchQuery}"` : "All Entries"}
          </span>
        </div>
        {totalResources !== undefined && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {resources.length} of {totalResources}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-border">
        {resources.map((resource, index) => (
          <div 
            key={String(resource._id)} 
            className="relative group animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ResourceCard resource={resource} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4 border-t border-border">
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  href={`/?page=${Math.max(1, page - 1)}&limit=${limit}${searchQuery ? `&search=${searchQuery}` : ''}`}
                  className={`font-mono text-[10px] uppercase tracking-widest border border-border hover:bg-foreground hover:text-background transition-colors ${page === 1 ? "pointer-events-none opacity-30" : ""}`}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-border bg-muted/20">
                  {page} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  href={`/?page=${Math.min(totalPages, page + 1)}&limit=${limit}${searchQuery ? `&search=${searchQuery}` : ''}`}
                  className={`font-mono text-[10px] uppercase tracking-widest border border-border hover:bg-foreground hover:text-background transition-colors ${page === totalPages ? "pointer-events-none opacity-30" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
