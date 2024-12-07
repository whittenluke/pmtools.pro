import { ChevronLeft, ChevronRight, Plus, Folder } from 'lucide-react';
import { useSupabase } from '../../lib/supabase/supabase-context';
import type { Project } from '../../types/project';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  selectedProject?: string;
  onSelectProject: (projectId: string) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export function Sidebar({ isExpanded, onToggle, selectedProject, onSelectProject, projects, setProjects }: SidebarProps) {
  const { supabase } = useSupabase();

  const createProject = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: newProject } = await supabase
      .from('projects')
      .insert([{
        title: 'New Project',
        user_id: user.id
      }])
      .select()
      .single();

    if (newProject) {
      setProjects([newProject, ...projects]);
      onSelectProject(newProject.id);
    }
  };

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
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white">Projects</h2>
            <button
              onClick={createProject}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="space-y-1">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md
                          ${selectedProject === project.id
                            ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
              >
                <Folder className="h-4 w-4 mr-3" />
                {project.title}
              </button>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
} 