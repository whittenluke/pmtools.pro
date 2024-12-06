import { ChevronLeft, ChevronRight } from 'lucide-react';

interface KanbanSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function KanbanSidebar({ isExpanded, onToggle }: KanbanSidebarProps) {
  return (
    <aside 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-800 
                  border-r dark:border-gray-700 transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-0'
      }`}
    >
      <button
        onClick={onToggle}
        className="absolute -right-4 top-4 bg-white dark:bg-gray-700 rounded-full p-1 
                  shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 
                  border dark:border-gray-600"
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
      
      {isExpanded && (
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center text-gray-700 dark:text-gray-300 
                                    hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-2">
                Home
              </a>
            </li>
          </ul>
        </nav>
      )}
    </aside>
  );
} 