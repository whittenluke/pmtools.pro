import React from 'react';

const features = [
  {
    name: 'Flexible Views',
    description: 'Switch seamlessly between Table, Kanban, Timeline, and Calendar views to visualize your work the way you want.',
    icon: '📊'
  },
  {
    name: 'Real-time Collaboration',
    description: 'Work together in real-time with your team. See changes instantly and stay in sync across all devices.',
    icon: '🤝'
  },
  {
    name: 'Powerful Automation',
    description: 'Automate repetitive tasks and workflows to save time and reduce errors. Focus on what matters most.',
    icon: '⚡'
  },
  {
    name: 'Custom Fields',
    description: 'Create custom fields to track the information that matters to your team. Adapt PMTools to your unique needs.',
    icon: '🎯'
  },
  {
    name: 'Advanced Analytics',
    description: 'Make data-driven decisions with built-in analytics and custom reports. Track progress and identify bottlenecks.',
    icon: '📈'
  },
  {
    name: 'Enterprise Security',
    description: 'Rest easy with enterprise-grade security features, including SSO, audit logs, and granular permissions.',
    icon: '🔒'
  }
];

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful features for modern teams
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Built with the latest technology and designed for scalability, PMTools.pro provides everything you need to manage projects effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <span className="text-3xl">{feature.icon}</span>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
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