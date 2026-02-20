import { AddResourceDialog } from '@/components/AddResourceDialog';
import { Layers } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="grid grid-cols-12 min-h-16 items-center">
        
        {/* Logo Section */}
        <div className="col-span-8 lg:col-span-10 flex items-center h-full border-r border-border px-6">
          <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-70">
            <Layers className="h-5 w-5" strokeWidth={1.5} />
            <span className="font-mono text-sm sm:text-base uppercase tracking-[0.2em] font-bold">SHADCN // DIRECTORY.</span>
          </Link>
        </div>

        {/* Action Section */}
        <div className="col-span-4 lg:col-span-2 flex items-center justify-center h-full px-4">
          <AddResourceDialog />
        </div>
        
      </div>
    </nav>
  );
}
