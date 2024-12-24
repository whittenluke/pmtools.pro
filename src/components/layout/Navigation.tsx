'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const navLinkStyles = "text-sm font-medium transition-colors text-muted-foreground/80 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground";
const signInStyles = "text-sm font-medium transition-colors text-primary/80 hover:text-primary dark:text-primary/80 dark:hover:text-primary";

export function Navigation() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return;
    }
    useAuthStore.setState({ user: null });
    router.push('/');
    router.refresh();
  };

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    if (pathname === '/') {
      const element = document.getElementById(section);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${section}`);
    }
  };

  return (
    <nav className="flex items-center justify-between w-full">
      {/* Main navigation */}
      <div className="flex items-center space-x-8">
        <a 
          href="/#features" 
          onClick={(e) => handleSectionClick(e, 'features')} 
          className={navLinkStyles}
        >
          Features
        </a>
        <a 
          href="/#pricing" 
          onClick={(e) => handleSectionClick(e, 'pricing')} 
          className={navLinkStyles}
        >
          Pricing
        </a>
      </div>

      {/* User navigation and utilities */}
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            {/* Core user navigation */}
            <div className="flex items-center space-x-6 mr-6">
              <Link href="/projects" className={navLinkStyles}>
                Projects
              </Link>
              <Link href="/account" className={navLinkStyles}>
                Account
              </Link>
            </div>
            
            {/* Utilities and session */}
            <div className="flex items-center space-x-4 border-l pl-6">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className={navLinkStyles}
              >
                Sign out
              </Button>
            </div>
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