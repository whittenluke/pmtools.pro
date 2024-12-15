import React from 'react';
import { plans } from './data';
import { Button } from '@/components/ui/button';

export function Pricing() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div key={plan.name} className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
              <div>
                <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-4xl font-bold tracking-tight">{plan.price === 'Custom' ? 'Custom' : `$${plan.price}`}</span>
                  {plan.price !== 'Custom' && <span className="text-sm font-semibold leading-6">/user/month</span>}
                </div>
                <p className="mt-6 text-base leading-7 text-gray-600">{plan.description}</p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant={plan.name === 'Pro' ? 'default' : 'outline'}
                className="mt-8 w-full"
                size="lg"
              >
                {plan.name === 'Enterprise' ? 'Contact sales' : 'Get started'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}