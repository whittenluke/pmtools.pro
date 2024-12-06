import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { KanbanTask } from '../../types/kanban';
import { useSupabase } from '../../lib/supabase/supabase-context';

interface TaskDetailsModalProps {
  task: KanbanTask | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: KanbanTask) => void;
  onDelete: (task: KanbanTask) => void;
}

export function TaskDetailsModal({ task, isOpen, onClose, onUpdate, onDelete }: TaskDetailsModalProps) {
  const { supabase } = useSupabase();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setTags(task.tags);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .update({
          title,
          description,
          tags,
          column_id: task.columnId,
          updated_at: new Date().toISOString()
        })
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const updatedTask: KanbanTask = {
          ...task,
          title,
          description,
          tags,
          updatedAt: new Date(data.updated_at)
        };
        onUpdate(updatedTask);
        onClose();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold bg-transparent border-none focus:ring-2 
                      focus:ring-indigo-500 rounded w-full text-gray-900 dark:text-white"
            placeholder="Task title"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 
                        shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={4}
              placeholder="Add description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                            font-medium bg-indigo-100 dark:bg-indigo-900 
                            text-indigo-800 dark:text-indigo-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="ml-1 text-indigo-600 dark:text-indigo-400 
                              hover:text-indigo-500 dark:hover:text-indigo-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => task && onDelete(task)}
            className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 
                      hover:text-red-700 dark:hover:text-red-300"
          >
            Delete
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 
                      hover:bg-indigo-700 rounded-md shadow-sm"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
} 