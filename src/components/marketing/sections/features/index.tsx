import React from 'react';
import { features } from './data';

export function Features() {
  return (
    <div className="bg-background py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 id="features" className="text-base font-semibold leading-7 text-primary">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Powerful features for{' '}
            <span className="text-primary dark:text-primary-foreground">modern teams</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Built with the latest technology and designed for scalability,{' '}
            <span className="text-primary dark:text-primary-foreground font-medium">PMTools.pro</span>{' '}
            provides everything you need to manage projects effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div 
                key={feature.name} 
                className="flex flex-col hover:translate-y-[-4px] transition-transform duration-200 ease-out"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <span className="text-3xl bg-primary/10 p-2 rounded-lg">{feature.icon}</span>
                  <span className="bg-gradient-to-r from-primary to-primary bg-[length:0px_2px] hover:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
                    {feature.name}
                  </span>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}