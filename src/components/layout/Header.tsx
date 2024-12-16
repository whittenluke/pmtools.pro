'use client';

import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // Transform header opacity based on scroll
  const headerOpacity = useTransform(
    scrollY,
    [0, 50],
    [0.95, 1]
  );

  // Transform backdrop blur based on scroll
  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(8px)', 'blur(12px)']
  );

  // Handle scroll direction for show/hide
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const updateHeader = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      
      if (direction === "down" && scrollY > 100 && !isScrolled) {
        setIsScrolled(true);
      } else if (direction === "up" && isScrolled) {
        setIsScrolled(false);
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateHeader);
    return () => window.removeEventListener("scroll", updateHeader);
  }, [isScrolled]);

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "transition-transform duration-300",
        isScrolled && "-translate-y-full"
      )}
      style={{
        opacity: headerOpacity,
        backdropFilter: headerBlur,
      }}
    >
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold text-lg">
              <span className="text-primary">PM</span>
              <span className="text-foreground">Tools</span>
            </span>
          </a>
        </div>
        <Navigation />
      </div>
    </motion.header>
  );
}