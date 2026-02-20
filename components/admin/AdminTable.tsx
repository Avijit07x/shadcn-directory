"use client";

import { bulkDeleteResources, bulkUpdateResourceStatus } from "@/app/admin/actions";
import { AdminRowActions } from "@/components/AdminRowActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IResource } from "@/models/Resource";
import { CheckCircle, Loader2, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AdminTableProps {
  resources: IResource[];
  page: number;
  totalPages: number;
  statusFilter: string;
}

export function AdminTable({ resources, page, totalPages, statusFilter }: AdminTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);

  const resourceIds = resources.map(r => String(r._id));
  const allSelected = resources.length > 0 && selectedIds.length === resources.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < resources.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(resourceIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const handleBulkUpdate = async (status: string) => {
    if (selectedIds.length === 0) return;
    
    try {
      setIsPending(true);
      await bulkUpdateResourceStatus(selectedIds, status);
      toast.success(`Successfully marked ${selectedIds.length} resources as ${status}`);
      setSelectedIds([]);
    } catch {
      toast.error(`Failed to bulk update status to ${status}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} resources?`)) return;

    try {
      setIsPending(true);
      await bulkDeleteResources(selectedIds);
      toast.success(`Successfully deleted ${selectedIds.length} resources`);
      setSelectedIds([]);
    } catch {
      toast.error(`Failed to bulk delete resources`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="bg-muted/30 border-b border-border p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest font-bold px-2">
              {selectedIds.length} Selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1.5 text-green-600 hover:text-green-600 hover:bg-green-600/10"
              onClick={() => handleBulkUpdate('approved')}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
              Approve Selected
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1.5 text-orange-600 hover:text-orange-600 hover:bg-orange-600/10"
              onClick={() => handleBulkUpdate('rejected')}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
              Reject Selected
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="h-8 gap-1.5 bg-red-600 text-white hover:bg-red-700"
              onClick={handleBulkDelete}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete Selected
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 uppercase tracking-widest text-[10px]"
              onClick={() => setSelectedIds([])}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/10 font-mono text-xs uppercase tracking-wider">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-5 w-12 px-4">
                <Checkbox 
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  aria-label="Select all"
                  className="translate-y-[2px]"
                />
              </TableHead>
              <TableHead className="py-5 font-bold text-foreground">Project</TableHead>
              <TableHead className="py-5 font-bold text-foreground">Submitter</TableHead>
              <TableHead className="py-5 font-bold text-foreground">Status</TableHead>
              <TableHead className="py-5 font-bold text-foreground text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground font-mono text-sm uppercase tracking-widest">
                  [ No Records Displayed ]
                </TableCell>
              </TableRow>
            )}
            {resources.map((resource) => {
              const resId = String(resource._id);
              const isSelected = selectedIds.includes(resId);
              
              return (
                <TableRow 
                  key={resId} 
                  className={`group transition-colors ${isSelected ? 'bg-muted/30' : 'hover:bg-muted/20'}`}
                >
                  <TableCell className="py-4 px-4">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectRow(checked as boolean, resId)}
                      aria-label={`Select ${resource.title}`}
                      className="translate-y-[2px]"
                    />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1.5">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline truncate max-w-[200px] sm:max-w-md">
                        {resource.title || resource.url}
                      </a>
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px] sm:max-w-md">
                        {resource.domain}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {resource.addedBy ? (
                      <div className="flex items-center gap-3">
                        <img src={resource.addedBy.image} alt="" className="w-7 h-7 bg-muted shrink-0" />
                        <span className="text-sm font-medium">{resource.addedBy.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground font-mono tracking-wider">SYSTEM_GHOST</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge 
                      variant="outline"
                      className={`
                        uppercase tracking-widest text-[10px] font-mono font-bold rounded-none px-2 py-1 border
                        ${resource.status === 'approved' ? 'border-green-500/30 text-green-500 bg-green-500/5' : ''}
                        ${resource.status === 'rejected' ? 'border-red-500/30 text-red-500 bg-red-500/5' : ''}
                        ${resource.status === 'pending' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' : ''}
                      `}
                    >
                      {resource.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <AdminRowActions id={resId} status={resource.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="border-t border-border p-4 bg-muted/10 font-mono">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                  <PaginationPrevious 
                    href={`/admin?page=${Math.max(1, page - 1)}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`}
                    className={page === 1 ? "pointer-events-none opacity-50" : "uppercase tracking-widest text-xs"}
                  />
              </PaginationItem>
              <PaginationItem>
                <span className="text-xs px-4 uppercase tracking-widest">Page {page} <span className="text-muted-foreground mx-1">/</span> {totalPages}</span>
              </PaginationItem>
              <PaginationItem>
                  <PaginationNext 
                    href={`/admin?page=${Math.min(totalPages, page + 1)}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`}
                    className={page === totalPages ? "pointer-events-none opacity-50" : "uppercase tracking-widest text-xs"}
                  />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
