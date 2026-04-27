"use client";
interface SkeletonProps { className?: string; width?: string; height?: string; }

export default function Skeleton({ className="", width, height }: SkeletonProps) {
  return <div className={["skeleton rounded-none", className].join(" ")} style={{ width, height }} aria-hidden="true" />;
}
export function SkeletonText({ lines=3, className="" }: { lines?: number; className?: string }) {
  return (
    <div className={["flex flex-col gap-2", className].join(" ")}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4" width={i === lines - 1 ? "60%" : "100%"} />
      ))}
    </div>
  );
}
export function SkeletonCard({ className="" }: { className?: string }) {
  return (
    <div className={["bg-white border border-[#E5E5EA] p-5 flex flex-col gap-3", className].join(" ")}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-3" width="40%" />
          <Skeleton className="h-2.5" width="60%" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}
