"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="w-full border-y border-border bg-muted/10 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-2 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-border p-4 bg-background">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
            <Search className="h-4 w-4" />
            Find
          </span>
        </div>
        <div className="lg:col-span-10 relative">
          <Input
            type="text"
            placeholder="TYPE TO FILTER ARCHIVE..."
            className="w-full h-16 md:h-20 text-lg md:text-2xl rounded-none border-0 bg-transparent focus-visible:ring-0 shadow-none font-mono tracking-widest uppercase placeholder:text-muted-foreground/30 px-6 md:px-10 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
