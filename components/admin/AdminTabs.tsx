import Link from "next/link";

interface AdminTabsProps {
  statusFilter: string;
  tabs: Array<{
    name: string;
    value: string;
    count?: number;
  }>;
}

export function AdminTabs({ statusFilter, tabs }: AdminTabsProps) {
  return (
    <div className="flex items-center overflow-x-auto border-b border-border bg-muted/20 hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = statusFilter === tab.value;
        return (
          <Link 
            key={tab.value}
            href={`/admin?status=${tab.value}`}
            className={`
              flex items-center gap-2 px-6 py-4 text-xs font-mono uppercase tracking-widest
              transition-colors whitespace-nowrap
              ${isActive 
                ? 'border-b-2 border-foreground text-foreground font-bold bg-background' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 border-b-2 border-transparent'}
            `}
          >
            {tab.name}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-foreground text-background text-[10px] px-2 py-0.5 min-w-5 text-center font-bold">
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
