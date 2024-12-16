import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 min-h-[calc(100vh-3.5rem)] flex items-center">
        <div className="flex flex-col lg:flex-row items-center gap-x-8 py-12 lg:py-24">
          <div className="flex-shrink-0 max-w-2xl lg:max-w-xl">
            <div>
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                  Latest Updates
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Project management for modern teams
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Streamline your workflow, boost productivity, and deliver projects on time with PMTools - the all-in-one project management solution built for today's teams.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500">
                Get started for free
              </Button>
              <Button variant="outline" size="lg">
                Schedule a demo
              </Button>
            </div>
          </div>
          <div className="flex-1 mt-8 lg:mt-0">
            <div className="max-w-3xl lg:max-w-none">
              <img
                src="./images/matrix.png"
                alt="Project Management Matrix"
                className="w-full rounded-md shadow-2xl ring-1 ring-white/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}