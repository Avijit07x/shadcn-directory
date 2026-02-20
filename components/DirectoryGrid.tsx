import { ResourceCard } from "@/components/ResourceCard";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { IResource } from "@/models/Resource";

interface DirectoryGridProps {
  resources: IResource[];
  page: number;
  totalPages: number;
  limit: number;
  searchQuery: string;
}

export function DirectoryGrid({ resources, page, totalPages, limit, searchQuery }: DirectoryGridProps) {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border border-dashed border-border p-12">
        <div className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          [ Empty Directory ]
        </div>
        <p className="text-muted-foreground max-w-sm font-mono text-xs uppercase tracking-wider">
          {searchQuery 
            ? `No matches for "${searchQuery}"` 
            : "No resources found."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-border">
        {resources.map((resource) => (
          <div key={String(resource._id)} className="relative group">
            <ResourceCard resource={resource} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href={`/?page=${Math.max(1, page - 1)}&limit=${limit}${searchQuery ? `&search=${searchQuery}` : ''}`}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm px-4">Page {page} of {totalPages}</span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                href={`/?page=${Math.min(totalPages, page + 1)}&limit=${limit}${searchQuery ? `&search=${searchQuery}` : ''}`}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
