import { ProfileGrid } from "@/components/ProfileGrid";
import dbConnect from "@/lib/mongodb";
import Resource, { IResource } from "@/models/Resource";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface UserProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata(props: UserProfilePageProps): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `${params.username}'s Profile`,
  };
}

export default async function UserProfilePage(props: UserProfilePageProps) {
  const params = await props.params;
  const username = params.username;

  if (!username) {
    notFound();
  }

  let resources: IResource[] = [];
  let userProfile = {
    name: "Unknown User",
    image: "https://placehold.co/100x100",
  };

  try {
    await dbConnect();
    
    const emailPrefixRegex = new RegExp(`^${username}@`, 'i');
    
    const fetchedResources = await Resource.find({ 
      'addedBy.email': { $regex: emailPrefixRegex },
      status: 'approved'
    })
      .sort({ createdAt: -1 })
      .lean();
      
    resources = JSON.parse(JSON.stringify(fetchedResources));
    
    if (resources.length > 0) {
      const firstResource = resources[0];
      if (firstResource.addedBy) {
        userProfile.name = firstResource.addedBy.name || userProfile.name;
        userProfile.image = firstResource.addedBy.image || userProfile.image;
      }
    }

  } catch (error) {
    console.error("Failed to load public user resources:", error);
  }

  return (
    <main className="flex-1 container mx-auto max-w-7xl px-4 py-12">
      <div className="mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-border pb-8">
        <div 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-border bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${userProfile.image})` }}
        />
        <div className="text-center sm:text-left flex flex-col justify-center h-full sm:mt-2">
          <h1 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight mb-2 uppercase">{userProfile.name}</h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
            @{username} • {resources.length} Approved Submissions
          </p>
        </div>
      </div>

      <div>
        <ProfileGrid resources={resources} />
      </div>
    </main>
  );
}
