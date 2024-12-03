import { useState, useEffect } from 'react';
import { Plus, List, LayoutDashboard } from 'lucide-react';
import type { KanbanBoard, KanbanTask, ViewMode } from '../../types/kanban';
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

  const addColumn = () => {
    const newColumn = {
      id: crypto.randomUUID(),
      title: 'New Column',
      order: board.columns.length,
      tasks: []
    };
    setBoard({
      ...board,
      columns: [...board.columns, newColumn]
    });
  };

  const addTask = (columnId: string) => {
    const newTask: KanbanTask = {
      id: crypto.randomUUID(),
      title: 'New Task',
      description: '',
      tags: [],
      columnId,
      order: board.columns.find(col => col.id === columnId)?.tasks.length || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBoard({
      ...board,
      columns: board.columns.map(col => 
        col.id === columnId 
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    });
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