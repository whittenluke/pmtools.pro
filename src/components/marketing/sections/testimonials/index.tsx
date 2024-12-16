import React from 'react';
import { testimonials } from './data';

export function Testimonials() {
  return (
    <div className="bg-primary py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary-foreground/90">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Trusted by industry leaders
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-foreground sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="rounded-2xl bg-background/95 backdrop-blur-sm p-10 shadow-lg ring-1 ring-black/5 hover:shadow-xl transition-shadow duration-200"
            >
              <blockquote className="text-foreground">
                <p className="before:content-['\u201C'] after:content-['\u201D'] before:text-primary after:text-primary">
                  {testimonial.content}
                </p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4 border-t border-primary/10 pt-4">
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-muted-foreground">
                    <span className="text-primary font-medium">{testimonial.role}</span>
                    {', '}
                    {testimonial.company}
                  </div>
                </div>
              </figcaption>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}