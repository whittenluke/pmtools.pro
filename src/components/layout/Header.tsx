import React from 'react';
import { Navigation } from './Navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold text-lg">
              <span className="text-primary">PM</span>
              <span className="text-foreground">Tools</span>
            </span>
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Navigation />
        </div>
      </div>
    </header>
  );
}