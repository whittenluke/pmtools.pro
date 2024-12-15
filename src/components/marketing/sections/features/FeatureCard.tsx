import React from 'react';
import type { Feature } from './types';

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="flex flex-col">
      <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
        <span className="text-3xl">{feature.icon}</span>
        {feature.name}
      </dt>
      <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
        <p className="flex-auto">{feature.description}</p>
      </dd>
    </div>
  );
}