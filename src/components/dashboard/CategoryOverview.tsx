import { Folder } from 'lucide-react';
import { categories } from '../../data/categories';

export function CategoryOverview() {
  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Tool Categories</h3>
        <Folder className="h-5 w-5 text-gray-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="p-4 rounded-lg bg-opacity-20 border border-opacity-20"
            style={{
              backgroundColor: `rgb(var(--${category.color}-900))`,
              borderColor: `rgb(var(--${category.color}-800))`
            }}
          >
            <h4 className="font-medium text-white">{category.name}</h4>
            <p className="mt-1 text-sm text-gray-400">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}