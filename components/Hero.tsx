import { ArrowDownRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full border-x border-t border-border mt-8 mb-16 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[50vh] md:min-h-[60vh] 2xl:min-h-[25vh]">
        <div className="lg:col-span-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border p-6 md:p-10 lg:p-14">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-foreground" />
            <span className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              INDEX // 001
            </span>
          </div>
          
          <div className="mt-16 lg:mt-0 pt-8 lg:pt-12 w-full">
            <h1 className="text-[14vw] sm:text-[11vw] lg:text-[7.5rem] xl:text-[8.5rem] 2xl:text-[10rem] min-[1800px]:text-[12rem] font-bold tracking-tighter uppercase leading-[0.8] text-foreground w-full wrap-break-word">
              SHADCN <br />
              <span className="text-muted-foreground/40">ARCHIVE</span>
            </h1>
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col justify-between p-6 md:p-10 lg:p-14 bg-muted/20">
          <div className="flex justify-end mb-12 lg:mb-0">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest border border-border px-2 py-1 bg-background">
              Constantly Updated
            </span>
          </div>
          
          <div className="mt-auto">
            <p className="font-mono text-xs md:text-sm leading-relaxed md:leading-loose text-foreground/80 uppercase tracking-widest mb-10">
              A definitive catalog of premium components, templates, and UI kits crafted for modern web experiences.
            </p>
            
            <div className="flex items-center gap-4 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest group cursor-default">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center border border-foreground bg-foreground text-background transition-colors group-hover:bg-background group-hover:text-foreground">
                <ArrowDownRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </div>
              <span>Scroll to <br/> Explore</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
