'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { 
    label: 'Home', 
    href: '/', 
    icon: '🏠',
    boxIcon: 'bx-home'
  },
  { 
    label: 'Explore', 
    href: '/explore', 
    icon: '🔍',
    boxIcon: 'bx-search'
  },
  { 
    label: 'Movies', 
    href: '/movies', 
    icon: '🎬',
    boxIcon: 'bx-movie'
  },
  { 
    label: 'TV Shows', 
    href: '/tv', 
    icon: '📺',
    boxIcon: 'bx-tv'
  },
  { 
    label: 'Profile', 
    href: '/profile', 
    icon: '👤',
    boxIcon: 'bx-user'
  },
  { 
    label: 'Settings', 
    href: '/settings', 
    icon: '⚙️',
    boxIcon: 'bx-cog'
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Box Icons CDN */}
      <link 
        href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' 
        rel='stylesheet'
      />
      
      <aside className="fixed left-0 top-0 z-40 h-screen w-16 bg-[#0f1316] border-r border-[#1b1f23] hidden lg:block">
        <div className="flex flex-col items-center py-6 space-y-6">
          {/* Logo */}
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col space-y-4">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                (pathname.startsWith(item.href) && item.href !== '/');
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group relative",
                    isActive 
                      ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg" 
                      : "bg-[#1b1f23] text-gray-400 hover:bg-[#232a30] hover:text-white"
                  )}
                >
                  <i className={`bx ${item.boxIcon} text-xl`}></i>
                  
                  {/* Tooltip */}
                  <span className="absolute left-16 bg-[#1b1f23] text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Back to Top Button (will be positioned separately) */}
        </div>
      </aside>
    </>
  );
}