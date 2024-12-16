import React from 'react';
import { plans } from './data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Pricing() {
  return (
    <div className="bg-primary text-primary-foreground py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="pricing" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-primary-foreground/80">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={cn(
                "flex flex-col justify-between rounded-3xl bg-background p-8 shadow-xl ring-1",
                plan.name === 'Pro' 
                  ? "relative ring-primary/50 dark:ring-primary/30 scale-[1.02] shadow-2xl" 
                  : "ring-primary/20 dark:ring-primary/10"
              )}
            >
              {plan.name === 'Pro' && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32">
                  <div className="rounded-full bg-primary py-1.5 px-4 text-sm font-semibold text-primary-foreground text-center shadow-lg">
                    Popular
                  </div>
                </div>
              )}
              <div>
                <h3 className={cn(
                  "text-lg font-semibold leading-8",
                  plan.name === 'Pro' ? "text-primary" : "text-foreground"
                )}>{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-foreground">
                  <span className="text-4xl font-bold tracking-tight">{plan.price === 'Custom' ? 'Custom' : `$${plan.price}`}</span>
                  {plan.price !== 'Custom' && <span className="text-sm font-semibold leading-6">/user/month</span>}
                </div>
                <p className="mt-6 text-base leading-7 text-muted-foreground">{plan.description}</p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <svg className={cn(
                        "h-6 w-5 flex-none",
                        plan.name === 'Pro' ? "text-primary" : "text-primary/70"
                      )} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant={plan.name === 'Pro' ? 'default' : 'outline'}
                className={cn(
                  "mt-8 w-full",
                  plan.name === 'Pro' 
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    : "bg-background text-primary dark:text-primary-foreground hover:bg-primary hover:text-primary-foreground border-primary/20 dark:border-primary-foreground/50"
                )}
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