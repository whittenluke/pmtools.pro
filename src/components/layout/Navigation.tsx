'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';

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
    <nav className="flex items-center space-x-8">
      <button 
        onClick={() => scrollToSection('features')}
        className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        Features
      </button>
      <button 
        onClick={() => scrollToSection('pricing')}
        className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        Pricing
      </button>
      {user ? (
        <>
          <Link href="/projects" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Projects
          </Link>
          <Link href="/account" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Account
          </Link>
        </>
      ) : (
        <Link href="/login" className="text-sm font-medium text-primary hover:text-primary/90">
          Sign in
        </Link>
      )}
    </nav>
  );
}