import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import type { KanbanBoard } from '../../types/kanban';
import type { Project } from '../../types/project';
import { TableView } from '../../components/kanban/TableView';
import { useSupabase } from '../../lib/supabase/supabase-context';
import { ErrorBoundary } from 'react-error-boundary';
import { Sidebar } from '../../components/layout/Sidebar';
import { debounce } from '../../lib/utils';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 text-red-500">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function PMTable() {
  const { supabase } = useSupabase();
  const [board, setBoard] = useState<KanbanBoard>({
    id: '1',
    title: 'My Project',
    columns: []
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  // Combine all initialization into a single effect
  useEffect(() => {
    const initializeBoard = async () => {
      try {
        const { error } = await supabase.auth.getUser();
        if (error) throw error;
        
        // First load projects
        await loadProjects();
        
        // Then check for last selected project
        const lastProjectId = localStorage.getItem('lastSelectedProjectId');
        if (lastProjectId) {
          setSelectedProjectId(lastProjectId);
          await loadBoard(lastProjectId);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeBoard();
  }, []); // Single initialization effect

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
  };

  const debouncedSaveTitle = useCallback(
    debounce(async (projectId: string, newTitle: string) => {
      try {
        const { error } = await supabase
          .from('projects')
          .update({ title: newTitle })
          .eq('id', projectId);
        
        if (error) throw error;
        setSaveStatus('saved');
      } catch (error) {
        console.error('Failed to update project title:', error);
        setSaveStatus('error');
      }
    }, 750),
    [supabase]
  );

  const updateProjectTitle = (newTitle: string) => {
    if (!selectedProjectId) return;

    setSaveStatus('saving');
    setBoard(prev => ({ ...prev, title: newTitle }));
    
    setProjects(prev => prev.map(project => 
      project.id === selectedProjectId 
        ? { ...project, title: newTitle }
        : project
    ));

    debouncedSaveTitle(selectedProjectId, newTitle);
  };

  // Update project selection handler to persist selection
  const handleProjectSelect = async (projectId: string) => {
    setSelectedProjectId(projectId);
    localStorage.setItem('lastSelectedProjectId', projectId);
    await loadBoard(projectId);
  };

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const { error } = await supabase.auth.getUser();
        if (error) throw error;
        
        await loadBoard();
      } catch (error) {
        console.error('Auth error:', error);
      }
    };

    checkAuthAndLoad();
  }, []);

  const loadBoard = async (projectId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get or create default board for this project
      let { data: boards } = await supabase
        .from('kanban_boards')
        .select('*')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .limit(1);

      let boardId;

      if (!boards || boards.length === 0) {
        // Create default board
        const { data: newBoard } = await supabase
          .from('kanban_boards')
          .insert([
            { title: 'My Project', user_id: user.id }
          ])
          .select()
          .single();

        boardId = newBoard?.id;
      } else {
        boardId = boards[0].id;
      }

      // Load columns
      const { data: columns } = await supabase
        .from('kanban_columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position');

      // Load tasks for each column
      const { data: tasks } = await supabase
        .from('kanban_tasks')
        .select('*')
        .eq('board_id', boardId)
        .order('position');

      // Organize tasks into columns
      const organizedColumns = (columns || []).map(column => ({
        ...column,
        tasks: (tasks || [])
          .filter(task => task.column_id === column.id)
          .sort((a, b) => a.position - b.position)
      }));

      setBoard({
        id: boardId,
        title: boards?.[0]?.title || 'My Project',
        columns: organizedColumns
      });
    } catch (error) {
      console.error('Failed to load board:', error);
    }
  };

  const addColumn = async () => {
    try {
      const { data: newColumn } = await supabase
        .from('kanban_columns')
        .insert([
          {
            title: 'New Column',
            board_id: board.id,
            position: board.columns.length
          }
        ])
        .select()
        .single();

      if (newColumn) {
        setBoard(prev => ({
          ...prev,
          columns: [...prev.columns, { ...newColumn, tasks: [] }]
        }));
      }
    } catch (error) {
      console.error('Failed to add column:', error);
    }
  };

  // Add save status cleanup
  useEffect(() => {
    if (saveStatus === 'saved') {
      const timer = setTimeout(() => {
        setSaveStatus(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          isExpanded={isSidebarExpanded}
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
          selectedProject={selectedProjectId}
          onSelectProject={handleProjectSelect}
          projects={projects}
          setProjects={setProjects}
        />
        
        <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-0'}`}>
          {/* Header */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={board.title}
                onChange={(e) => updateProjectTitle(e.target.value)}
                className={`text-2xl font-bold bg-transparent border-none outline-none 
                           focus:outline-none focus:ring-0 hover:bg-gray-50 dark:hover:bg-gray-800/50
                           focus:bg-gray-50 dark:focus:bg-gray-800/50 rounded px-2 -ml-2
                           transition-colors duration-150 ease-in-out
                           text-gray-900 dark:text-white placeholder-gray-400 
                           dark:placeholder-gray-500`}
              />
              {saveStatus && (
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-300
                    ${saveStatus === 'saved' ? 'animate-fade-out' : 'opacity-100'}`}
                  >
                    {saveStatus === 'saving' ? (
                      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse" />
                        Saving
                      </div>
                    ) : saveStatus === 'saved' ? (
                      <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500" />
                        Saved
                      </div>
                    ) : saveStatus === 'error' ? (
                      <div className="flex items-center gap-1.5 text-red-500 dark:text-red-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                        Failed to save
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={addColumn}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Column
                </button>
              </div>
            </div>
          </div>

          {/* View */}
          <div className="h-full overflow-auto">
            <TableView board={board} setBoard={setBoard} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 