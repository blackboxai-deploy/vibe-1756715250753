"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Home, 
  Search, 
  Film, 
  Tv, 
  Settings, 
  HelpCircle,
  MoreHorizontal,
  Sun,
  Moon
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const sidebarItems = [
  {
    icon: Home,
    label: "Home",
    href: "/",
    id: "home"
  },
  {
    icon: Search,
    label: "Explore",
    href: "/search",
    id: "explore"
  },
  {
    icon: Film,
    label: "Movies",
    href: "/movies",
    id: "movies"
  },
  {
    icon: Tv,
    label: "TV Shows",
    href: "/tv",
    id: "tv"
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
    id: "settings"
  },
  {
    icon: HelpCircle,
    label: "FAQs",
    href: "/faqs",
    id: "faqs"
  },
  {
    icon: MoreHorizontal,
    label: "More",
    href: "/more",
    id: "more"
  }
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider>
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r border-border/40",
        "hidden md:flex flex-col items-center py-6 space-y-4",
        className
      )}>
        {/* Logo/Brand */}
        <div className="mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
            <Film className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "w-12 h-12 rounded-xl transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      "hover:scale-105 hover:shadow-lg",
                      active && "bg-gradient-to-br from-orange-400 to-yellow-500 text-white shadow-lg scale-105"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="w-5 h-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={cn(
                "w-12 h-12 rounded-xl transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                "hover:scale-105 hover:shadow-lg"
              )}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <p>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</p>
          </TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
}