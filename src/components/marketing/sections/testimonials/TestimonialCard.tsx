import React from 'react';
import type { Testimonial } from './types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="rounded-2xl bg-white p-10 shadow-md">
      <blockquote className="text-gray-900">
        <p>{`"${testimonial.content}"`}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-x-4">
        <div>
          <div className="font-semibold">{testimonial.author}</div>
          <div className="text-gray-600">{`${testimonial.role}, ${testimonial.company}`}</div>
        </div>
      </figcaption>
    </div>
  );
}