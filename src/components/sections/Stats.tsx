import React from 'react';
import { Users, Clock, Award, Zap } from 'lucide-react';

export function Stats() {
  const stats = [
    {
      label: 'Active Users',
      value: '50,000+',
      icon: Users,
      description: 'Professionals trust our tools'
    },
    {
      label: 'Hours Saved',
      value: '1M+',
      icon: Clock,
      description: 'Collective productivity gained'
    },
    {
      label: 'Tool Rating',
      value: '4.9/5',
      icon: Award,
      description: 'Average user satisfaction'
    },
    {
      label: 'Tasks Automated',
      value: '500K+',
      icon: Zap,
      description: 'Workflows optimized'
    }
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center">
                  <Icon className="h-8 w-8 text-indigo-600" />
                </div>
                <p className="mt-4 text-4xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="mt-2 text-lg font-medium text-gray-600">{stat.label}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}