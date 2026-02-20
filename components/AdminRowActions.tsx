"use client";

import { deleteResourceItem, updateResourceStatus } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AdminRowActionsProps {
  id: string;
  status: string;
}

export function AdminRowActions({ id, status }: AdminRowActionsProps) {
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    try {
      setIsPending(true);
      await updateResourceStatus(id, newStatus);
      toast.success(`Resource marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update resource status");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      setIsPending(true);
      await deleteResourceItem(id);
      toast.success("Resource deleted successfully");
    } catch {
      toast.error("Failed to delete resource");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {status !== 'approved' && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1.5 text-green-600 hover:text-green-600 hover:bg-green-600/10" 
          onClick={() => handleUpdate('approved')}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
          Approve
        </Button>
      )}
      {status !== 'rejected' && (
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1.5 text-orange-600 hover:text-orange-600 hover:bg-orange-600/10" 
          onClick={() => handleUpdate('rejected')}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
          Reject
        </Button>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-red-600 hover:text-red-600 hover:bg-red-600/10" 
        onClick={handleDelete}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </div>
  );
}
