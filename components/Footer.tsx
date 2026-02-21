"use client";

import logo from "@/app/icon.svg";
import { ArrowUp, Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-border bg-background mt-8 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent" />
      
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-14">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
               <div className="font-mono text-xs sm:text-sm uppercase tracking-wider sm:tracking-[0.2em] font-bold truncate flex items-center gap-2">
              <Image src={logo} className="size-6" alt="Logo" width={100} height={100} />
              SHADCN <span className="hidden sm:inline">{"// DIRECTORY."}</span>
            </div>
            </div>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider leading-relaxed max-w-xs">
              A definitive catalog of premium components, templates, and UI kits
              crafted for modern web experiences.
            </p>
          </div>

          <div className="md:col-span-1 flex flex-col items-start md:items-center">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Connect
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/Avijit07x/shadcn-directory"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center border border-border transition-all duration-200 hover:bg-foreground hover:text-background hover:border-foreground hover:-translate-y-0.5"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/Avijit07x"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex h-9 w-9 items-center justify-center border border-border transition-all duration-200 hover:bg-foreground hover:text-background hover:border-foreground hover:-translate-y-0.5"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/avijit07x"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center border border-border transition-all duration-200 hover:bg-foreground hover:text-background hover:border-foreground hover:-translate-y-0.5"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-1 flex flex-col items-start md:items-end">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Navigation
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span>Back to top</span>
              <div className="flex h-7 w-7 items-center justify-center border border-border group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-200 group-hover:-translate-y-0.5">
                <ArrowUp className="h-3 w-3" />
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border py-6">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            &copy; {new Date().getFullYear()} ShadCN Directory. All rights
            reserved.
          </span>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Open Source under MIT License
          </span>
        </div>
      </div>
    </footer>
  );
}
