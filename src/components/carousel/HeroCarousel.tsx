'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Plus, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Movie, TVShow } from '@/types';
import { getImageUrl } from '@/lib/api/tmdb';
import { useWatchlist } from '@/hooks/useWatchlist';
import { VideoPlayer } from '@/components/player/VideoPlayer';

interface HeroCarouselProps {
  items: (Movie | TVShow)[];
  autoPlay?: boolean;
  interval?: number;
}

export function HeroCarousel({ items, autoPlay = true, interval = 5000 }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Movie | TVShow | null>(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const currentItem = items[currentIndex];
  const isMovie = 'title' in currentItem;
  const title = isMovie ? currentItem.title : currentItem.name;
  const releaseDate = isMovie ? currentItem.release_date : currentItem.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (autoPlay && !isPlaying) {
      const timer = setInterval(nextSlide, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, isPlaying, nextSlide, interval]);

  const handlePlay = () => {
    setSelectedItem(currentItem);
    setIsPlaying(true);
  };

  const handleWatchlist = () => {
    const watchlistItem = {
      id: currentItem.id,
      type: isMovie ? 'movie' as const : 'tv' as const,
      title,
      poster_path: currentItem.poster_path,
      vote_average: currentItem.vote_average,
      release_date: isMovie ? currentItem.release_date : undefined,
      first_air_date: !isMovie ? currentItem.first_air_date : undefined,
    };

    if (isInWatchlist(currentItem.id, isMovie ? 'movie' : 'tv')) {
      removeFromWatchlist(currentItem.id, isMovie ? 'movie' : 'tv');
    } else {
      addToWatchlist(watchlistItem);
    }
  };

  if (!items.length) return null;

  return (
    <>
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden rounded-2xl">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(currentItem.backdrop_path, 'original')}
            alt={title}
            fill
            className="object-cover"
            style={{
              filter: 'saturate(120%) contrast(130%)',
            }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white border-0 h-12 w-12 rounded-full backdrop-blur-sm"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white border-0 h-12 w-12 rounded-full backdrop-blur-sm"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="max-w-2xl space-y-6">
              {/* Rating Badge */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {currentItem.vote_average.toFixed(1)}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  {isMovie ? 'Movie' : 'TV Show'}
                </Badge>
                {year && (
                  <Badge variant="outline" className="border-white/30 text-white">
                    {year}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                {title}
              </h1>

              {/* Overview */}
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl line-clamp-3">
                {currentItem.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-full"
                  onClick={handlePlay}
                >
                  <Play className="h-5 w-5 mr-2 fill-current" />
                  Play Now
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full backdrop-blur-sm"
                  onClick={handleWatchlist}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {isInWatchlist(currentItem.id, isMovie ? 'movie' : 'tv') ? 'Remove from' : 'Add to'} Watchlist
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/10 px-8 py-3 rounded-full backdrop-blur-sm"
                >
                  <Info className="h-5 w-5 mr-2" />
                  More Info
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-yellow-500 w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        {autoPlay && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-yellow-500 transition-all duration-100 ease-linear"
              style={{
                width: `${((Date.now() % interval) / interval) * 100}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedItem && (
        <VideoPlayer
          item={selectedItem}
          isOpen={isPlaying}
          onClose={() => {
            setIsPlaying(false);
            setSelectedItem(null);
          }}
        />
      )}
    </>
  );
}