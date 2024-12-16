import React from 'react';
import { testimonials } from './data';

export function Testimonials() {
  return (
    <div className="bg-background dark:bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 text-primary">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by industry leaders
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <div 
                key={i} 
                className="relative rounded-2xl bg-primary/[0.03] dark:bg-primary/10 p-8 shadow-sm ring-1 ring-primary/10 hover:shadow-md transition-shadow duration-300"
              >
                <figure className="h-full flex flex-col justify-between gap-6">
                  <blockquote className="text-lg leading-8 text-foreground">
                    <p>"{testimonial.content}"</p>
                  </blockquote>
                  <figcaption className="flex items-center gap-x-4 border-t border-primary/10 pt-4">
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.author}</div>
                      <div className="mt-1 flex items-center gap-x-2">
                        <span className="text-primary font-medium">{testimonial.role}</span>
                        {testimonial.company && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{testimonial.company}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}