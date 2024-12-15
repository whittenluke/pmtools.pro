import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';

export function Navigation() {
  const { user } = useAuthStore();

  return (
    <nav className="flex items-center space-x-8">
      <Link href="/features" className="text-sm font-medium text-gray-700 hover:text-gray-900">
        Features
      </Link>
      <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
        Pricing
      </Link>
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