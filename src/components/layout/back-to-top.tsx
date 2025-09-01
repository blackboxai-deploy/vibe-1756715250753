'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling 50% of page
      const scrolled = document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrolled / maxHeight) * 100;
      
      setIsVisible(scrollPercentage > 50);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-24 lg:bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg transition-all duration-300 transform",
        isVisible 
          ? "translate-y-0 opacity-100 scale-100" 
          : "translate-y-16 opacity-0 scale-75 pointer-events-none"
      )}
      size="icon"
    >
      <i className="bx bx-chevron-up text-xl"></i>
    </Button>
  );
}