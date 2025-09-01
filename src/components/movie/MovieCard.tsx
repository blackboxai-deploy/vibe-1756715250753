'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Heart, Star, Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Movie, TVShow } from '@/types';
import { useWatchlist } from '@/hooks/useWatchlist';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
  className?: string;
  showPlayButton?: boolean;
  onPlay?: () => void;
}

export function MovieCard({ 
  item, 
  type, 
  className, 
  showPlayButton = true,
  onPlay 
}: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const title = type === 'movie' ? (item as Movie).title : (item as TVShow).name;
  const releaseDate = type === 'movie' 
    ? (item as Movie).release_date 
    : (item as TVShow).first_air_date;
  
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = item.vote_average;
  const posterUrl = item.poster_path 
    ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/w500${item.poster_path}`
    : '/placeholder-poster.jpg';

  const isWatchlisted = isInWatchlist(item.id, type);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWatchlisted) {
      removeFromWatchlist(item.id, type);
    } else {
      addToWatchlist({
        id: item.id,
        type,
        title,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        release_date: type === 'movie' ? (item as Movie).release_date : undefined,
        first_air_date: type === 'tv' ? (item as TVShow).first_air_date : undefined,
        addedAt: Date.now()
      });
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPlay?.();
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('group cursor-pointer', className)}
    >
      <Link href={`/${type}/${item.id}`} className="block">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Poster Container */}
          <div className="relative aspect-[2/3] bg-muted rounded-t-lg overflow-hidden">
            {/* White Frame */}
            <div className="absolute inset-2 bg-white rounded-xl overflow-hidden shadow-inner">
              {!imageError ? (
                <Image
                  src={posterUrl}
                  alt={title}
                  fill
                  className={cn(
                    'object-cover transition-all duration-300 group-hover:scale-105',
                    'filter saturate-130',
                    !imageLoaded && 'opacity-0'
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-muted-foreground text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-2 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium">{title}</p>
                  </div>
                </div>
              )}

              {/* Loading Skeleton */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
              )}

              {/* HD Badge */}
              <Badge 
                variant="secondary" 
                className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 backdrop-blur-sm"
              >
                HD
              </Badge>

              {/* Play Button Overlay */}
              {showPlayButton && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    onClick={handlePlay}
                  >
                    <Play className="w-4 h-4 mr-1 fill-current" />
                    Play
                  </Button>
                </div>
              )}

              {/* Watchlist Button */}
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  'absolute top-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200',
                  'opacity-0 group-hover:opacity-100',
                  isWatchlisted && 'opacity-100 bg-red-500/80 hover:bg-red-500'
                )}
                onClick={handleWatchlistToggle}
              >
                <Heart 
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isWatchlisted ? 'fill-white text-white' : 'text-white'
                  )} 
                />
              </Button>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 space-y-2">
            {/* Title */}
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-3">
                {/* Year */}
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {year}
                </span>

                {/* Rating */}
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {rating.toFixed(1)}
                </span>
              </div>

              {/* Type Badge */}
              <Badge variant="outline" className="text-xs">
                {type === 'movie' ? 'Movie' : 'TV'}
              </Badge>
            </div>

            {/* Runtime for movies */}
            {type === 'movie' && (item as Movie).runtime && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {(item as Movie).runtime} min
              </div>
            )}

            {/* Episode count for TV shows */}
            {type === 'tv' && (item as TVShow).number_of_episodes && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="w-3 h-3 mr-1" />
                {(item as TVShow).number_of_episodes} episodes
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}