"use client";

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/movie/MovieCard';
import { Movie, TVShow } from '@/types';

interface GenreCarouselProps {
  title: string;
  items: (Movie | TVShow)[];
  viewAllHref?: string;
  className?: string;
}

export function GenreCarousel({ title, items, viewAllHref, className = '' }: GenreCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current || isScrolling) return;
    
    setIsScrolling(true);
    const container = scrollContainerRef.current;
    const cardWidth = 280; // Card width + gap
    const scrollAmount = cardWidth * 3; // Scroll 3 cards at a time
    
    const targetScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    });

    setTimeout(() => {
      setIsScrolling(false);
      checkScrollButtons();
    }, 300);
  };

  const handleScroll = () => {
    if (!isScrolling) {
      checkScrollButtons();
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white dark:text-white">
          {title}
        </h2>
        {viewAllHref && (
          <Button
            variant="ghost"
            className="text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
            onClick={() => window.location.href = viewAllHref}
          >
            View All
          </Button>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-0 rounded-full w-12 h-12 transition-all duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } group-hover:opacity-100`}
          onClick={() => scroll('left')}
          disabled={!canScrollLeft || isScrolling}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white border-0 rounded-full w-12 h-12 transition-all duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } group-hover:opacity-100`}
          onClick={() => scroll('right')}
          disabled={!canScrollRight || isScrolling}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          onScroll={handleScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-64">
              <MovieCard
                item={item}
                type={'title' in item ? 'movie' : 'tv'}
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0f1316] to-transparent pointer-events-none z-[5]" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0f1316] to-transparent pointer-events-none z-[5]" />
      </div>
    </div>
  );
}