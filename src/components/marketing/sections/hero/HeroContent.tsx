'use client';

import { Button } from '@/components/ui/button';
import { HeroTitle } from './HeroTitle';

export function HeroContent() {
  return (
    <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
      <div className="mt-24 sm:mt-32 lg:mt-16">
        <a href="#" className="inline-flex space-x-6">
          <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
            Latest Updates
          </span>
        </a>
      </div>
      <HeroTitle />
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Streamline your workflow, boost productivity, and deliver projects on time with PMTools.pro - the all-in-one project management solution built for today's teams.
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
  );
}