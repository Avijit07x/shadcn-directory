"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchBarProps {
  initialSearchQuery?: string;
}

export function SearchBar({ initialSearchQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialSearchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query !== initialSearchQuery) {
        if (query) {
          router.push(`/?search=${encodeURIComponent(query)}`, { scroll: false });
        } else {
          router.push(`/`, { scroll: false });
        }
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, initialSearchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isFocused && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  const clearSearch = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  return (
    <div className={`w-full border-y mb-12 transition-all duration-300 ${
      isFocused 
        ? "border-foreground/40 bg-foreground/2 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]" 
        : "border-border bg-muted/10"
    }`}>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className={`lg:col-span-2 flex items-center justify-center border-b lg:border-b-0 lg:border-r p-4 transition-colors duration-300 ${
          isFocused ? "border-foreground/40 bg-foreground/3" : "border-border bg-background"
        }`}>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-2">
            <Search className={`h-4 w-4 transition-colors duration-300 ${isFocused ? "text-foreground" : ""}`} />
            Find
          </span>
        </div>
        <div className="lg:col-span-10 relative flex items-center">
          <Input
            ref={inputRef}
            type="text"
            placeholder="TYPE TO FILTER ARCHIVE..."
            className="w-full h-16 md:h-20 text-lg md:text-2xl rounded-none border-0 bg-transparent focus-visible:ring-0 shadow-none font-mono tracking-widest uppercase placeholder:text-muted-foreground/30 px-6 md:px-10 transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="absolute right-4 md:right-8 flex items-center gap-2">
            {query && (
              <button
                onClick={clearSearch}
                className="flex h-7 w-7 items-center justify-center border border-border bg-background hover:bg-foreground hover:text-background transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            {!query && !isFocused && (
              <kbd className="hidden sm:inline-flex h-6 items-center border border-border bg-muted/50 px-2 font-mono text-[10px] text-muted-foreground tracking-wider">
                /
              </kbd>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
