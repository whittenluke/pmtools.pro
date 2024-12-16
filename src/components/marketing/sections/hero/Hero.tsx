'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
  const scrollToFeatures = () => {
    const section = document.getElementById('features');
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
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-primary/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 min-h-[calc(100vh-3.5rem)] flex items-center">
        <div className="flex flex-col lg:flex-row items-center gap-x-8 py-12 lg:py-24">
          <div className="flex-shrink-0 max-w-2xl lg:max-w-xl">
            <div>
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10">
                  Latest Updates
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-6xl">
              <span className="text-primary dark:text-primary-foreground">Project management</span>{' '}
              <span className="text-foreground">for modern teams</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground font-medium">
              Streamline your workflow, boost productivity, and deliver projects on time with{' '}
              <span className="text-primary dark:text-primary-foreground font-semibold">PMTools</span>{' '}
              - the all-in-one project management solution built for today's teams.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button 
                size="lg" 
                className="shadow-lg hover:shadow-primary/25 transition-shadow duration-200"
              >
                Get started for free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={scrollToFeatures}
                className="border-primary/20 hover:bg-primary/5 transition-colors duration-200"
              >
                View Features
              </Button>
            </div>
          </div>
          <div className="flex-1 mt-8 lg:mt-0">
            <div className="max-w-3xl lg:max-w-none relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-md" />
              <img
                src="./images/matrix.png"
                alt="Project Management Matrix"
                className="w-full rounded-md shadow-2xl ring-1 ring-black/5 relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}