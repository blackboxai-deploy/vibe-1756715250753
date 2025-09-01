import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'poster' | 'text' | 'circle' | 'carousel' | 'detail';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  variant = 'card', 
  count = 1 
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={cn(
            "bg-card rounded-[14px] overflow-hidden shadow-lg animate-pulse",
            className
          )}>
            <div className="p-2">
              <div className="bg-white/10 rounded-[12px] aspect-[2/3] mb-3 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[12px]" />
                <div className="absolute bottom-2 right-2 bg-white/20 rounded-full px-2 py-1">
                  <div className="w-6 h-3 bg-white/30 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="flex items-center space-x-2">
                  <div className="h-3 bg-white/10 rounded w-12" />
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  <div className="h-3 bg-white/10 rounded w-8" />
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  <div className="h-3 bg-white/10 rounded w-16" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'poster':
        return (
          <div className={cn(
            "bg-white/10 rounded-[12px] aspect-[2/3] animate-pulse relative overflow-hidden",
            className
          )}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="absolute bottom-2 right-2 bg-white/20 rounded-full px-2 py-1">
              <div className="w-6 h-3 bg-white/30 rounded" />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={cn("space-y-2 animate-pulse", className)}>
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-4/5" />
            <div className="h-4 bg-white/10 rounded w-3/5" />
          </div>
        );

      case 'circle':
        return (
          <div className={cn(
            "w-12 h-12 bg-white/10 rounded-full animate-pulse",
            className
          )} />
        );

      case 'carousel':
        return (
          <div className="flex space-x-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-48">
                <div className="bg-card rounded-[14px] overflow-hidden shadow-lg animate-pulse">
                  <div className="p-2">
                    <div className="bg-white/10 rounded-[12px] aspect-[2/3] mb-3 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[12px]" />
                      <div className="absolute bottom-2 right-2 bg-white/20 rounded-full px-2 py-1">
                        <div className="w-6 h-3 bg-white/30 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="flex items-center space-x-2">
                        <div className="h-3 bg-white/10 rounded w-12" />
                        <div className="w-1 h-1 bg-white/10 rounded-full" />
                        <div className="h-3 bg-white/10 rounded w-8" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'detail':
        return (
          <div className="animate-pulse">
            {/* Backdrop skeleton */}
            <div className="relative h-[50vh] bg-white/10 mb-8">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-8 left-8 flex items-end space-x-6">
                <div className="bg-white/10 rounded-[12px] w-48 aspect-[2/3]" />
                <div className="space-y-4 flex-1">
                  <div className="h-8 bg-white/10 rounded w-2/3" />
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="flex space-x-4">
                    <div className="h-10 bg-white/10 rounded w-24" />
                    <div className="h-10 bg-white/10 rounded w-32" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="container mx-auto px-4 space-y-8">
              <div className="space-y-4">
                <div className="h-6 bg-white/10 rounded w-32" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-4/5" />
                  <div className="h-4 bg-white/10 rounded w-3/5" />
                </div>
              </div>
              
              {/* Cast skeleton */}
              <div className="space-y-4">
                <div className="h-6 bg-white/10 rounded w-24" />
                <div className="flex space-x-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 text-center">
                      <div className="w-16 h-16 bg-white/10 rounded-full mb-2" />
                      <div className="h-3 bg-white/10 rounded w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={cn(
            "h-4 bg-white/10 rounded animate-pulse",
            className
          )} />
        );
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;