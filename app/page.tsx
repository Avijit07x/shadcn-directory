import { DirectoryGrid } from "@/components/DirectoryGrid";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import dbConnect from "@/lib/mongodb";
import Resource, { IResource } from "@/models/Resource";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const limit = typeof searchParams.limit === 'string' ? parseInt(searchParams.limit, 10) : 12;
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : "";

  let resources: IResource[] = [];
  let totalPages = 1;

  try {
    await dbConnect();
    
    interface ResourceQuery {
      status: string;
      $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
    }
    
    const query: ResourceQuery = { status: 'approved' };
    
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { domain: { $regex: searchQuery, $options: "i" } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const [fetchedResources, total] = await Promise.all([
      Resource.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Resource.countDocuments(query)
    ]);
    
    resources = JSON.parse(JSON.stringify(fetchedResources));
    totalPages = Math.ceil(total / limit) || 1;
    
  } catch (error) {
    console.error("Failed to load resources. Is MongoDB connected?", error);
  }

  return (
    <>
      <main className="flex-1 container mx-auto max-w-7xl px-4">
        <Hero />
        
        <SearchBar initialSearchQuery={searchQuery} />

        <div className="w-full">
          <DirectoryGrid 
            resources={resources} 
            page={page} 
            totalPages={totalPages} 
            limit={limit} 
            searchQuery={searchQuery} 
          />
        </div>
      </main>
    </>
  );
}
