import React from 'react';
import { categories } from '../../data/categories';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          selectedCategory === null
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => onCategoryChange(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.name}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === category.name
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onCategoryChange(category.name)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}