import React from 'react';
import { categories } from '../../data/categories';
import { Folder } from 'lucide-react';

export function CategoryOverview() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Tool Categories</h3>
        <Folder className="h-5 w-5 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`p-4 rounded-lg bg-${category.color}-50 border border-${category.color}-200`}
          >
            <h4 className="font-medium text-gray-900">{category.name}</h4>
            <p className="mt-1 text-sm text-gray-500">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}