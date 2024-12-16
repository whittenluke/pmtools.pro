'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const navLinkStyles = "text-sm font-medium transition-colors text-muted-foreground/80 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground";
const signInStyles = "text-sm font-medium transition-colors text-primary/80 hover:text-primary dark:text-primary/80 dark:hover:text-primary";

export function Navigation() {
  const { user } = useAuthStore();

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = 56; // h-14 in pixels
      const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="flex items-center">
      <div className="flex items-center space-x-8">
        <button 
          onClick={() => scrollToSection('features')}
          className={navLinkStyles}
        >
          Features
        </button>
        <button 
          onClick={() => scrollToSection('pricing')}
          className={navLinkStyles}
        >
          Pricing
        </button>
      </div>
      <div className="flex items-center space-x-8 ml-8">
        {user ? (
          <>
            <Link href="/projects" className={navLinkStyles}>
              Projects
            </Link>
            <Link href="/account" className={navLinkStyles}>
              Account
            </Link>
          </>
        ) : (
          <>
            <ThemeToggle />
            <Link href="/login" className={signInStyles}>
              Sign in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}