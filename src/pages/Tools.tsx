import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Clock, 
  LineChart, 
  Calendar, 
  FileText, 
  Kanban, 
  Target, 
  Repeat, 
  Workflow
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToolStore } from '../store/toolStore';
import { SearchBar } from '../components/tools/SearchBar';
import { CategoryFilter } from '../components/tools/CategoryFilter';
import type { Tool } from '../types/tool';

export function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const tools: Tool[] = [
    {
      id: 'calculator',
      name: 'Calculator',
      description: 'Professional calculator with advanced features',
      icon: Calculator,
      path: '/tools/calculator',
      category: 'Calculation'
    },
    {
      id: 'pomodoro-timer',
      name: 'Pomodoro Timer',
      description: 'Focus and time management with Pomodoro technique',
      icon: Clock,
      path: '/tools/pomodoro',
      category: 'Time Management'
    },
    {
      id: 'estimation',
      name: 'Project Estimation',
      description: 'Estimate project costs and timelines',
      icon: LineChart,
      path: '/tools/estimation',
      category: 'Project Planning'
    },
    {
      id: 'meeting-planner',
      name: 'Meeting Planner',
      description: 'Schedule and organize meetings across time zones',
      icon: Calendar,
      path: '/tools/meeting-planner',
      category: 'Time Management'
    },
    {
      id: 'note-taking',
      name: 'Smart Notes',
      description: 'Intelligent note-taking with AI assistance',
      icon: FileText,
      path: '/tools/notes',
      category: 'Documentation'
    },
    {
      id: 'kanban-board',
      name: 'Kanban Board',
      description: 'Visual project management with drag-and-drop',
      icon: Kanban,
      path: '/tools/kanban',
      category: 'Project Planning'
    },
    {
      id: 'goal-tracker',
      name: 'Goal Tracker',
      description: 'Set and track personal and team goals',
      icon: Target,
      path: '/tools/goals',
      category: 'Productivity'
    },
    {
      id: 'habit-tracker',
      name: 'Habit Tracker',
      description: 'Build and maintain productive habits',
      icon: Repeat,
      path: '/tools/habits',
      category: 'Productivity'
    },
    {
      id: 'workflow-builder',
      name: 'Workflow Builder',
      description: 'Create and automate work processes',
      icon: Workflow,
      path: '/tools/workflow',
      category: 'Automation'
    }
  ];

  const addUsage = useToolStore((state) => state.addUsage);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        !selectedCategory || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Productivity Tools
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Choose from our collection of professional tools
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory} 
        />
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col"
              onClick={() => addUsage(tool.id)}
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-8 flex-grow flex flex-col">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 flex-grow line-clamp-2">
                  {tool.description}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {tool.category}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-500">No tools found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}