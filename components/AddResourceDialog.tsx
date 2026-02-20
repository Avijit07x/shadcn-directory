"use client";

import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddResourceDialog() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL (e.g., https://magicui.design)");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add resource");
      }

      toast.success("Resource added successfully!");
      setOpen(false);
      setUrl("");
      router.refresh();
      
    } catch (error: any) {
      toast.error(error.message || "An error occurred while adding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-medium">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline-block">Add Resource</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new resource</DialogTitle>
          <DialogDescription>
            Enter the URL of a ShadCN-related library, tool, or template. We'll automatically fetch the details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">Resource URL</Label>
            <Input
              id="url"
              placeholder="https://ui.shadcn.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Resource"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
