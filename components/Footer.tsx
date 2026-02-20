import logo from "@/app/icon.svg";
import { Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background mt-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="font-mono text-xs sm:text-sm uppercase tracking-wider sm:tracking-[0.2em] font-bold truncate flex items-center gap-2">
              <Image src={logo} className="size-6" alt="Logo" width={100} height={100} />
              SHADCN <span className="hidden sm:inline">{"// DIRECTORY."}</span>
            </div>
            </div>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider leading-relaxed max-w-sm">
              A definitive catalog of premium components, templates, and UI kits
              crafted for modern web experiences.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Connect
            </span>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Avijit07x/shadcn-directory"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:bg-foreground hover:text-background hover:border-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/Avijit07x"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:bg-foreground hover:text-background hover:border-foreground"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/avijit07x"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:bg-foreground hover:text-background hover:border-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
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
