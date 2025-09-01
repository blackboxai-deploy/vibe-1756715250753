'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Movie, TVShow, SearchResult } from '@/types';
import { getImageUrl, formatVoteAverage, getYearFromDate } from '@/lib/api/tmdb';
import { useWatchlist } from '@/hooks/use-watchlist';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  item: Movie | TVShow | SearchResult;
  type?: 'movie' | 'tv';
  size?: 'sm' | 'md' | 'lg';
  showOverlay?: boolean;
  className?: string;
}

export default function MovieCard({ 
  item, 
  type: propType, 
  size = 'md', 
  showOverlay = true,
  className 
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  // Determine type
  const mediaType = propType || 
    ('title' in item ? 'movie' : 
     'name' in item ? 'tv' : 
     'media_type' in item ? item.media_type as 'movie' | 'tv' : 'movie');

  // Get title and date
  const title = 'title' in item ? item.title : 'name' in item ? item.name : '';
  const releaseDate = 'release_date' in item ? item.release_date : 
                     'first_air_date' in item ? item.first_air_date : '';

  const year = getYearFromDate(releaseDate);
  const rating = formatVoteAverage(item.vote_average);
  const isInWatchlistItem = isInWatchlist(item.id, mediaType);

  // Size variants
  const sizeClasses = {
    sm: 'w-36 h-48',
    md: 'w-48 h-64',
    lg: 'w-56 h-72'
  };

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(item as Movie | TVShow, mediaType);
  };

  return (
    <Link 
      href={`/${mediaType === 'movie' ? 'movies' : 'tv'}/${item.id}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <div 
        className={cn(
          "group relative bg-[#1b1f23] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer",
          "hover:-translate-y-2 hover:shadow-yellow-500/20",
          sizeClasses[size],
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Poster Container */}
        <div className="relative h-4/5 bg-white rounded-2xl m-2 overflow-hidden">
          {/* Poster Image */}
          <div className={cn(
            "relative w-full h-full transition-transform duration-300",
            isHovered ? "scale-105" : "scale-100"
          )}>
            {!imageError ? (
              <img
                src={getImageUrl(item.poster_path, size === 'lg' ? 'w500' : 'w342')}
                alt={title}
                className="w-full h-full object-cover rounded-xl"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-[#2a3441] rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <i className="bx bx-image text-4xl mb-2"></i>
                  <p className="text-sm px-2">{title}</p>
                </div>
              </div>
            )}
          </div>

          {/* HD Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium">
            HD
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/80 text-yellow-500 text-xs px-2 py-1 rounded-full font-medium flex items-center">
            <i className="bx bx-star mr-1"></i>
            {rating}
          </div>

          {/* Hover Overlay */}
          {showOverlay && isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl flex items-end justify-center pb-4 transition-opacity duration-300">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium rounded-full px-4"
                >
                  <i className="bx bx-play mr-1"></i>
                  Play
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleWatchlistToggle}
                  className={cn(
                    "bg-black/60 backdrop-blur-sm border-white/20 text-white hover:bg-black/80 rounded-full",
                    isInWatchlistItem && "bg-red-500/80 hover:bg-red-600/80"
                  )}
                >
                  <i className={`bx ${isInWatchlistItem ? 'bxs-heart' : 'bx-heart'} text-lg`}></i>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Meta Information */}
        <div className="p-3 pt-2">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>{year || 'TBA'}</span>
              <span>•</span>
              <div className="flex items-center">
                <i className="bx bx-star text-yellow-500 mr-1"></i>
                <span>{rating}</span>
              </div>
            </div>
            <div className="bg-[#2a3441] text-gray-300 px-2 py-1 rounded-full capitalize text-xs">
              {mediaType === 'tv' ? 'TV' : 'Movie'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}