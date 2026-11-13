import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/10 dark:bg-slate-700/40 rounded-xl",
        className
      )}
    />
  );
}

export function AnalysisResultSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto py-8">
      {/* Top Banner Skeleton */}
      <div className="p-6 rounded-3xl bg-theme-surfaceGlass border border-theme-border space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-20 w-full" />
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-theme-surfaceGlass border border-theme-border space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="p-6 rounded-3xl bg-theme-surfaceGlass border border-theme-border space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>

      {/* Checklist Skeleton */}
      <div className="p-6 rounded-3xl bg-theme-surfaceGlass border border-theme-border space-y-4">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-3 w-full rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
