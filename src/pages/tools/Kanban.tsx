import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { KanbanBoard } from '../../types/kanban';
import { KanbanView } from '../../components/kanban/KanbanView';
import { useSupabase } from '../../lib/supabase/supabase-context';
import { ErrorBoundary } from 'react-error-boundary';
import { Sidebar } from '../../components/layout/Sidebar';

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

  // Load board data
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
      if (!boards?.length) {
        const { data: newBoard } = await supabase
          .from('kanban_boards')
          .insert({ user_id: user.id, title: 'My Project' })
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

      // Transform the data to ensure columnId matches and dates are properly typed
      const transformedColumns = columns?.map(column => ({
        ...column,
        tasks: column.tasks.map(task => ({
          ...task,
          columnId: column.id,
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at)
        }))
      }));

      setBoard({
        id: boardId,
        title: boards?.[0]?.title || 'My Project',
        columns: transformedColumns || []
      });
    } catch (error) {
      console.error('Error loading board:', error);
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
    await loadBoard(projectId);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="w-full [&~footer]:hidden">
        <Sidebar 
          isExpanded={isSidebarExpanded} 
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} 
          selectedProject={selectedProjectId}
          onSelectProject={handleProjectSelect}
        />
        
        {/* Fixed header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className={`transition-all duration-300 ease-in-out ${
              isSidebarExpanded ? 'ml-64' : 'ml-0'
            }`}>
              <input
                type="text"
                value={board.title}
                onChange={(e) => setBoard({ ...board, title: e.target.value })}
                className="text-2xl font-bold bg-transparent border-none focus:ring-0"
                id="board-title"
                name="board-title"
                aria-label="Board title"
              />
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