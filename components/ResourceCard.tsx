"use client";

import { IResource } from "@/models/Resource";
import { ArrowDownRight } from "lucide-react";

interface ResourceCardProps {
  resource: IResource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group h-full relative focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground focus-visible:ring-offset-0"
    >
      <div className="h-full flex flex-col bg-background border-r border-b border-border transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:z-10 group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.3)] relative">
        <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border group-hover:border-background/20">
          
          {resource.addedBy && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-2 py-1 border border-border">
              <img 
                src={resource.addedBy.image || "https://placehold.co/100x100"} 
                alt={resource.addedBy.name} 
                className="w-4 h-4 rounded-full"
              />
              <span className="text-[9px] font-mono font-medium tracking-wider truncate max-w-[100px] text-foreground uppercase">
                {resource.addedBy.name}
              </span>
            </div>
          )}

          {resource.image ? (
            <>
              <img
                src={resource.image}
                alt={resource.title || resource.domain}
                className="object-cover w-full h-full transition-all duration-500 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/1200x630/000000/ffffff?text=NO+IMAGE&font=mono';
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex h-full font-mono text-xs uppercase tracking-widest items-center justify-center text-muted-foreground group-hover:text-background/50 bg-black/5 group-hover:bg-background/5">
              [ NO IMAGE ]
            </div>
          )}
          
          <div className="absolute top-0 right-0 p-3 bg-background border-b border-l border-border transition-colors duration-300 group-hover:bg-foreground group-hover:border-background/20">
            <ArrowDownRight className="h-4 w-4 text-foreground transition-all duration-300 group-hover:text-background -rotate-90 group-hover:rotate-0" />
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-foreground group-hover:bg-background" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-background/70">
                {resource.domain}
              </span>
            </div>
          </div>
          
          <h3 className="line-clamp-1 text-lg font-bold tracking-tight uppercase mb-2">
            {resource.title || resource.domain}
          </h3>
          
          <p className="text-xs font-mono text-muted-foreground group-hover:text-background/80 line-clamp-2 leading-relaxed mt-auto">
            {resource.description || 'No description available for this archive entry.'}
          </p>
        </div>
      </div>
    </a>
  );
}
