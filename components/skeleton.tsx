import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonCardProps {
    arr: number;
}

export function SkeletonCard({ arr }: SkeletonCardProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
            {[...Array(arr)].map((_, i) => (
                <div key={i} className="p-4 rounded-lg shadow-lg bg-white">
                    {/* Image Skeleton */}
                    <div className="relative">
                        <Skeleton className="w-full h-40 rounded-lg mb-4 bg-slate-200" />
                        <Skeleton className="absolute bottom-4 left-4 shadow-md w-12 h-12 rounded-full bg-white" />
                    </div>

                    {/* Title Skeleton */}
                    <Skeleton className="h-6 w-3/4 mb-2 bg-slate-200" />

                    {/* Subtitle Skeleton */}
                    <Skeleton className="h-4 w-1/2 bg-slate-200" />
                </div>
            ))}
        </div>

    );
}
