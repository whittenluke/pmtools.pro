import React from 'react';

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      quote: "PMTools.pro has transformed how our team manages projects. The estimation tool alone has saved us countless hours."
    },
    {
      name: "Michael Chen",
      role: "Engineering Lead at StartupX",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      quote: "The workflow builder is a game-changer. We've automated so many processes that used to take hours."
    },
    {
      name: "Emily Rodriguez",
      role: "Freelance Consultant",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      quote: "As a consultant, having all these professional tools in one place is invaluable. Highly recommended!"
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Trusted by Professionals Worldwide
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Join thousands of productivity enthusiasts who've transformed their workflow
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <img
                  className="h-12 w-12 rounded-full"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <blockquote>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}