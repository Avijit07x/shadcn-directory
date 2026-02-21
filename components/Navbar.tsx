"use client";

import logo from "@/app/icon.svg";
import { Button } from "@/components/ui/button";
import { useUIStore } from '@/lib/store';
import { LogOut, Plus } from 'lucide-react';
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AddResourceModal = dynamic(() => import('@/components/AddResourceModal').then(m => m.AddResourceModal), { ssr: false });

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const setAddModalOpen = useUIStore(state => state.setAddModalOpen);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-16 items-center w-full max-w-7xl mx-auto">
        
        <div className="flex flex-1 items-center h-full border-r border-border px-4 sm:px-6 min-w-0">
          <Link 
            href="/" 
            onClick={() => router.refresh()}
            className="flex items-center space-x-2 sm:space-x-3 transition-opacity hover:opacity-70 min-w-0"
          >
            
            <div className="font-mono text-xs sm:text-sm uppercase tracking-wider sm:tracking-[0.2em] font-bold truncate flex items-center gap-2">
              <Image src={logo} className="size-10" alt="Logo" width={100} height={100} />
              SHADCN <span className="hidden sm:inline">{"// DIRECTORY."}</span>
              <span className="relative flex items-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-none bg-foreground/20" />
                <span className="relative inline-flex items-center border border-foreground bg-foreground text-background px-1.5 py-0.5 text-[9px] font-bold tracking-widest">
                  BETA
                </span>
              </span>
            </div>
          </Link>
        </div>

        <div className="shrink-0 flex items-center justify-center h-full px-4 sm:px-6 gap-3">
          {session?.user?.isAdmin && (
            <Link href="/admin">
              <Button variant="outline" className="hidden sm:flex" size="sm">
                Admin Panel
              </Button>
            </Link>
          )}

          {session ? (
            <Button className="gap-2 font-medium" onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block">Add Resource</span>
              <span className="sm:hidden">Add</span>
            </Button>
          ) : (
            <Button className="gap-2 font-medium" onClick={() => signIn("google")}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline-block">Add Resource</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
          <AddResourceModal />
          
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="transition-opacity hover:opacity-80">
                <div 
                  className="w-8 h-8 rounded-full border border-border bg-cover bg-center"
                  style={{ backgroundImage: `url(${session.user?.image || "https://placehold.co/100x100"})` }}
                  title="My Profile"
                />
              </Link>
              <Button variant="ghost" size="icon" onClick={() => signOut()} title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => signIn("google")}>
              Login
            </Button>
          )}
        </div>
        
      </div>
    </nav>
  );
}
