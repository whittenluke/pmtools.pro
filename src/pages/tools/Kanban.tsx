import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import type { KanbanBoard } from '../../types/kanban';
import type { Project } from '../../types/project';
import { KanbanView } from '../../components/kanban/KanbanView';
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

export default function Kanban() {
  const { supabase } = useSupabase();
  const [board, setBoard] = useState<KanbanBoard>({
    id: '1',
    title: 'My Project',
    columns: []
  });
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  const loadProjects = async () => {
    try {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

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

  // Load board data
  const loadBoard = async (projectId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !projectId) return; // Early return if no projectId

      // Load project details first
      const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (project) {
        setBoard(prev => ({ ...prev, title: project.title }));
      }

      // Get or create default board for this project
      let { data: boards } = await supabase
        .from('kanban_boards')
        .select('*')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .limit(1);

      let boardId;
      if (!boards?.length) {
        // Create default board
        const { data: newBoard } = await supabase
          .from('kanban_boards')
          .insert({ 
            user_id: user.id, 
            project_id: projectId,
            title: board.title // Use current board title
          })
          .select()
          .single();
        boardId = newBoard?.id;
      } else {
        boardId = boards[0].id;
      }

      // Load columns with tasks
      const { data: columns } = await supabase
        .from('kanban_columns')
        .select(`
          id,
          title,
          position,
          tasks:kanban_tasks(
            id,
            title,
            description,
            tags,
            position,
            column_id,
            created_at,
            updated_at
          )
        `)
        .eq('board_id', boardId)
        .order('position');

      // Transform the data
      const transformedColumns = columns?.map(column => ({
        ...column,
        tasks: column.tasks.map(task => ({
          ...task,
          columnId: column.id,
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at)
        }))
      }));

      setBoard(prev => ({
        ...prev,
        id: boardId,
        columns: transformedColumns || []
      }));
    } catch (error) {
      console.error('Failed to load board:', error);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('kanban_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'kanban_tasks' 
      }, () => {
        // Handle real-time updates
        loadBoard();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update functions
  const addColumn = async () => {
    try {
      const { data: newColumn } = await supabase
        .from('kanban_columns')
        .insert({
          board_id: board.id,
          title: 'New Column',
          position: board.columns.length
        })
        .select()
        .single();

      if (newColumn) {
        setBoard({
          ...board,
          columns: [...board.columns, { ...newColumn, tasks: [] }]
        });
      }
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  const addTask = async (columnId: string) => {
    try {
      const { data: newTask } = await supabase
        .from('kanban_tasks')
        .insert({
          column_id: columnId,
          title: 'New Task',
          position: board.columns.find(col => col.id === columnId)?.tasks.length || 0
        })
        .select()
        .single();

      if (newTask) {
        setBoard({
          ...board,
          columns: board.columns.map(col =>
            col.id === columnId
              ? { ...col, tasks: [...col.tasks, newTask] }
              : col
          )
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Add project selection handler
  const handleProjectSelect = async (projectId: string) => {
    setSelectedProjectId(projectId);
    localStorage.setItem('lastSelectedProjectId', projectId);
    await loadBoard(projectId);
  };

  // Add debounced save function
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
    
    // Update projects list immediately for smooth UI
    setProjects(prev => prev.map(project => 
      project.id === selectedProjectId 
        ? { ...project, title: newTitle }
        : project
    ));

    debouncedSaveTitle(selectedProjectId, newTitle);
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
      <div className="w-full [&~footer]:hidden">
        <Sidebar 
          isExpanded={isSidebarExpanded}
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
          selectedProject={selectedProjectId}
          onSelectProject={handleProjectSelect}
          projects={projects}
          setProjects={setProjects}
        />
        
        {/* Fixed header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className={`transition-all duration-300 ease-in-out ${
              isSidebarExpanded ? 'ml-64' : 'ml-0'
            }`}>
              <div className="flex items-center gap-4">
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
                  id="board-title"
                  name="board-title"
                  aria-label="Board title"
                />
                {/* Move save status next to title */}
                {saveStatus && (
                  <div className="flex items-center">
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
              </div>
            </div>
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

        {/* Board container */}
        <div className={`transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? 'ml-64' : 'ml-0'
        }`}>
          <div className="w-full">
            <KanbanView board={board} setBoard={setBoard} addTask={addTask} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 