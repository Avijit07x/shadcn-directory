import { AddResourceDialog } from '@/components/AddResourceDialog';
import { Layers } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-16 items-center w-full max-w-7xl mx-auto">
        
        {/* Logo Section */}
        <div className="flex flex-1 items-center h-full border-r border-border px-4 sm:px-6 min-w-0">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 transition-opacity hover:opacity-70 min-w-0">
            <Layers className="h-5 w-5 shrink-0" strokeWidth={1.5} />
            <span className="font-mono text-xs sm:text-sm uppercase tracking-wider sm:tracking-[0.2em] font-bold truncate">
              SHADCN <span className="hidden sm:inline">// DIRECTORY.</span>
            </span>
          </Link>
        </div>

        {/* Action Section */}
        <div className="shrink-0 flex items-center justify-center h-full px-4 sm:px-6">
          <AddResourceDialog />
        </div>
        
      </div>
    </nav>
  );
}
