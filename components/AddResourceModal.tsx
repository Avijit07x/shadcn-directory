"use client";

import { addResourceAction } from "@/app/actions";
import { useUIStore } from "@/lib/store";
import { Loader2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddResourceModal() {
  const { isAddModalOpen, setAddModalOpen } = useUIStore();
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
      const result = await addResourceAction(url);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Resource added successfully!");
      setAddModalOpen(false);
      setUrl("");
      router.refresh();
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred while adding");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new resource</DialogTitle>
          <DialogDescription>
            Enter the URL of a ShadCN-related library, tool, or template. We&apos;ll automatically fetch the details.
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
