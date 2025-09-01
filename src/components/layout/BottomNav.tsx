'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Search, 
  Film, 
  Tv, 
  Settings, 
  HelpCircle, 
  MoreHorizontal,
  User,
  Heart
} from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Explore', href: '/search' },
  { icon: Film, label: 'Movies', href: '/movies' },
  { icon: Tv, label: 'TV Shows', href: '/tv' },
  { icon: User, label: 'Profile', href: '/profile' },
];

const moreItems = [
  { icon: Heart, label: 'Watchlist', href: '/profile?tab=watchlist' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: HelpCircle, label: 'FAQs', href: '/faqs' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.more-menu')) {
        setShowMore(false);
      }
    };

    if (showMore) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMore]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" />
      )}

      {/* More Menu */}
      {showMore && (
        <div className="more-menu fixed bottom-20 right-4 bg-background/95 backdrop-blur-md border border-border rounded-2xl p-2 shadow-2xl z-50 md:hidden">
          {moreItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setShowMore(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  'hover:bg-accent/50 active:scale-95',
                  isActive(item.href) && 'bg-accent text-accent-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
        <div className="mx-4 mb-4">
          <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl px-2 py-2 shadow-2xl">
            <div className="flex items-center justify-between">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200',
                      'hover:bg-accent/30 active:scale-95 min-w-[60px]',
                      active && 'bg-accent/20'
                    )}
                  >
                    <div className={cn(
                      'p-2 rounded-lg transition-all duration-200',
                      active ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      'text-xs font-medium mt-1 transition-colors duration-200',
                      active ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
              
              {/* More Button */}
              <button
                onClick={() => setShowMore(!showMore)}
                className={cn(
                  'flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200',
                  'hover:bg-accent/30 active:scale-95 min-w-[60px]',
                  showMore && 'bg-accent/20'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg transition-all duration-200',
                  showMore ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'
                )}>
                  <MoreHorizontal className="w-5 h-5" />
                </div>
                <span className={cn(
                  'text-xs font-medium mt-1 transition-colors duration-200',
                  showMore ? 'text-primary' : 'text-muted-foreground'
                )}>
                  More
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Safe area padding for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-transparent" />
      </nav>
    </>
  );
}