'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { 
    label: 'Explore', 
    href: '/', 
    boxIcon: 'bx-search'
  },
  { 
    label: 'Movies', 
    href: '/movies', 
    boxIcon: 'bx-movie'
  },
  { 
    label: 'TV Shows', 
    href: '/tv', 
    boxIcon: 'bx-tv'
  },
  { 
    label: 'Profile', 
    href: '/profile', 
    boxIcon: 'bx-user'
  },
  { 
    label: 'More', 
    href: '/settings', 
    boxIcon: 'bx-dots-horizontal-rounded'
  }
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-4 mb-4">
        <nav className="bg-black/60 backdrop-blur-md rounded-full px-4 py-3 border border-white/10">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (pathname.startsWith(item.href) && item.href !== '/');
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center space-y-1 px-3 py-2 rounded-full transition-all duration-200",
                    isActive 
                      ? "text-yellow-500" 
                      : "text-gray-400"
                  )}
                >
                  <i className={`bx ${item.boxIcon} text-xl`}></i>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}