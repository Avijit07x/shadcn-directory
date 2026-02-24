import { ResourceImage } from "@/components/ResourceImage";
import dbConnect from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { ArrowLeft, Calendar, ExternalLink, Globe } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResourceDetailsPage(props: PageProps) {
  const params = await props.params;
  
  await dbConnect();

  let resource;
  try {
    resource = await Resource.findById(params.id).lean();
  } catch (error) {

    notFound();
  }

  if (!resource) {
    notFound();
  }

  const date = new Date(resource.createdAt);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

  return (
    <main className="flex-1 container mx-auto max-w-7xl px-4 py-12 min-h-screen">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </Link>

      <article className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        <div className="space-y-8">
          <div className="aspect-video w-full overflow-hidden border border-border bg-muted relative">
            {resource.image ? (
              <ResourceImage 
                src={resource.image} 
                alt={resource.title || resource.domain} 
              />
            ) : (
              <div className="flex h-full font-mono text-xl uppercase tracking-widest items-center justify-center text-muted-foreground bg-black/5">
                [ NO IMAGE ]
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase mb-4 border-b border-border pb-4">
              About
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap mb-8">
                {resource.description || 'No description available for this archive entry.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 lg:mt-0 mt-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
               <span className="h-2 w-2 bg-foreground" />
               <h1 className="text-3xl font-bold tracking-tight uppercase leading-none">
                 {resource.title || resource.domain}
               </h1>
            </div>
            
            <a 
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between w-full bg-foreground text-background px-6 py-4 font-mono font-bold tracking-widest uppercase hover:bg-background hover:text-foreground hover:outline hover:outline-foreground transition-all duration-300"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>

          <div className="border border-border p-6 space-y-6 bg-background/50">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Archive Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Domain</div>
                  <div className="font-medium text-sm">{resource.domain}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Added On</div>
                  <div className="font-medium text-sm">{formattedDate}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-5 h-5 border border-border rounded-full shrink-0 mt-0.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${resource.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                </span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Status</div>
                  <div className="font-medium text-sm uppercase">{resource.status}</div>
                </div>
              </div>
            </div>
          </div>

          {resource.addedBy && (
            <div className="border border-border p-6 bg-background/50">
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Submitted By
              </h3>
              <div className="flex items-center gap-4">
                <img 
                  src={resource.addedBy.image || "https://placehold.co/100x100"} 
                  alt={resource.addedBy.name} 
                  className="w-10 h-10 rounded-full border border-border"
                />
                <div>
                  <div className="font-bold text-sm uppercase tracking-wider">{resource.addedBy.name}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
