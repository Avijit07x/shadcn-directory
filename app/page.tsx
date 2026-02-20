"use client";

import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { ResourceCard } from "@/components/ResourceCard";
import { SearchBar } from "@/components/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { IResource } from "@/models/Resource";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [resources, setResources] = useState<IResource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("/api/resources");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setResources(data);
      } catch (error) {
        toast.error("Failed to load resources. Is MongoDB connected?");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter((resource) => {
    const query = searchQuery.toLowerCase();
    return (
      (resource.title || "").toLowerCase().includes(query) ||
      (resource.description || "").toLowerCase().includes(query) ||
      (resource.domain || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen flex flex-col relative pb-20">
      <Navbar />
      
      <main className="flex-1 container mx-auto max-w-7xl px-4">
        <Hero />
        
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-border">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col border-r border-b border-border p-5 bg-background h-[360px]">
                  <Skeleton className="h-[180px] w-full rounded-none mb-6" />
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-3/4 rounded-none" />
                    <Skeleton className="h-4 w-1/2 rounded-none" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-border">
              {filteredResources.map((resource) => (
                <div key={String(resource._id)} className="relative group">
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </main>
    </div>
  );
}
