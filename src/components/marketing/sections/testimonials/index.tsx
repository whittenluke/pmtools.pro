import React from 'react';
import { testimonials } from './data';

export function Testimonials() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-400">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trusted by industry leaders
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-2xl bg-white p-10 shadow-md">
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
          ))}
        </div>
      </div>
    </div>
  );
}