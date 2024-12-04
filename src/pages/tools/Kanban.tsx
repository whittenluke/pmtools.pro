import { useState, useEffect } from 'react';
import { Plus, List, LayoutDashboard } from 'lucide-react';
import type { KanbanBoard, ViewMode } from '../../types/kanban';
import { KanbanView } from '../../components/kanban/KanbanView';
import { TableView } from '../../components/kanban/TableView';
import { useSupabase } from '../../lib/supabase/supabase-context';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

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
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [board, setBoard] = useState<KanbanBoard>({
    id: '1',
    title: 'My Project',
    columns: []
  });
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Auth error:', error);
        throw error;
      }
      if (!user) {
        setShowAuthPrompt(true);
      }
    } catch (error) {
      console.error('Failed to check auth:', error);
      setShowAuthPrompt(true);
    }
  };

  // Load board data
  useEffect(() => {
    loadBoard();
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

  if (showAuthPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sign in to Use Kanban Board
            </h3>
            <p className="text-gray-600 mb-6">
              Create a free account to start organizing your projects with our Kanban board.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Get Started
              </button>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="w-full sm:w-auto text-gray-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              value={board.title}
              onChange={(e) => setBoard({ ...board, title: e.target.value })}
              className="text-2xl font-bold bg-transparent border-none focus:ring-0"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                {viewMode === 'kanban' ? <List /> : <LayoutDashboard />}
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

          {/* Views */}
          {viewMode === 'kanban' ? (
            <KanbanView board={board} setBoard={setBoard} addTask={addTask} />
          ) : (
            <TableView board={board} setBoard={setBoard} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
} 