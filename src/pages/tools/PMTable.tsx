import { useState, useEffect } from 'react';
import { Plus, List, LayoutDashboard } from 'lucide-react';
import type { KanbanBoard, ViewMode } from '../../types/kanban';
import { KanbanView } from '../../components/kanban/KanbanView';
import { TableView } from '../../components/kanban/TableView';
import { KanbanSidebar } from '../../components/kanban/KanbanSidebar';
import { useSupabase } from '../../lib/supabase/supabase-context';
import { ErrorBoundary } from 'react-error-boundary';

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
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [board, setBoard] = useState<KanbanBoard>({
    id: '1',
    title: 'My Project',
    columns: []
  });
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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

  const loadBoard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get or create default board
      let { data: boards } = await supabase
        .from('kanban_boards')
        .select('*')
        .eq('user_id', user.id)
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

  const addTask = async (columnId: string) => {
    try {
      const { data: newTask } = await supabase
        .from('kanban_tasks')
        .insert([
          {
            title: 'New Task',
            description: '',
            column_id: columnId,
            board_id: board.id,
            position: board.columns.find(col => col.id === columnId)?.tasks.length || 0,
            tags: []
          }
        ])
        .select()
        .single();

      if (newTask) {
        setBoard(prev => ({
          ...prev,
          columns: prev.columns.map(col => 
            col.id === columnId 
              ? { ...col, tasks: [...col.tasks, newTask] }
              : col
          )
        }));
      }
    } catch (error) {
      console.error('Failed to add task:', error);
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

  const updateBoardTitle = async (newTitle: string) => {
    try {
      const { error } = await supabase
        .from('kanban_boards')
        .update({ title: newTitle })
        .eq('id', board.id);
      
      if (error) throw error;
      
      setBoard(prev => ({
        ...prev,
        title: newTitle
      }));
    } catch (error) {
      console.error('Failed to update board title:', error);
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex h-[calc(100vh-4rem)]">
        <KanbanSidebar isExpanded={isSidebarExpanded} onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        
        <div className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-0'}`}>
          {/* Header */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={board.title}
                onChange={(e) => updateBoardTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-none focus:ring-0"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'table' ? 'kanban' : 'table')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 rounded"
                  title={`Switch to ${viewMode === 'table' ? 'Kanban' : 'Table'} view`}
                >
                  {viewMode === 'table' ? <LayoutDashboard /> : <List />}
                </button>
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

          {/* View Toggle */}
          <div className="h-full overflow-auto">
            {viewMode === 'table' ? (
              <TableView board={board} setBoard={setBoard} />
            ) : (
              <KanbanView board={board} setBoard={setBoard} addTask={addTask} />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 