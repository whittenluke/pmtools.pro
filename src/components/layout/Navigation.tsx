'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';

export function Navigation() {
  const { user } = useAuthStore();

  const scrollToSection = (sectionId: string) => {
    console.log('Attempting to scroll to:', sectionId);
    const section = document.getElementById(sectionId);
    console.log('Found section:', section);
    
    if (section) {
      const navHeight = 80;
      const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - navHeight;
      console.log('Scrolling to position:', targetPosition);
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="flex items-center space-x-8">
      <button 
        onClick={() => {
          console.log('Features button clicked');
          scrollToSection('features');
        }}
        className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        Features
      </button>
      <button 
        onClick={() => {
          console.log('Pricing button clicked');
          scrollToSection('pricing');
        }}
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
        <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      )}
    </nav>
  );
}