import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Pin, RotateCcw } from 'lucide-react';
import { useSupabase } from '../../lib/supabase/supabase-context';
import { Link } from 'react-router-dom';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export function Notes() {
  const { supabase } = useSupabase();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'trash'>('notes');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [activeTab]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('status', activeTab === 'notes' ? 'active' : 'trash')
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      sessionStorage.setItem('returnTo', '/tools/notes');
      setShowAuthPrompt(true);
      return;
    }

    // Switch to Notes tab first
    setActiveTab('notes');

    setIsSaving(true);
    try {
      const newNote = {
        title: '',
        content: '',
        tags: [],
        is_pinned: false,
        user_id: user.id,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select()
        .single();

      if (error) throw error;
      
      // Add new note while maintaining sort order (pinned notes first)
      setNotes(currentNotes => {
        const updatedNotes = [...currentNotes, data];
        return updatedNotes.sort((a, b) => {
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
      });
      setSelectedNote(data);
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateNote = async (updatedNote: Note) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          title: updatedNote.title,
          content: updatedNote.content,
          updated_at: new Date().toISOString() 
        })
        .eq('id', updatedNote.id);

      if (error) throw error;

      setNotes(currentNotes => 
        currentNotes.map(note => 
          note.id === updatedNote.id 
            ? { ...note, ...updatedNote, updated_at: new Date().toISOString() }
            : note
        )
      );

      setSelectedNote(updatedNote);
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          status: 'trash',
          deleted_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      if (activeTab === 'notes') {
        setNotes(notes.filter(note => note.id !== id));
        if (selectedNote?.id === id) {
          setSelectedNote(null);
        }
      }
    } catch (error) {
      console.error('Error moving note to trash:', error);
    }
  };

  const restoreNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          status: 'active',
          is_pinned: false,
          deleted_at: null
        })
        .eq('id', id);

      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error restoring note:', error);
    }
  };

  const togglePin = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      try {
        const newUpdatedAt = new Date().toISOString();
        const { error } = await supabase
          .from('notes')
          .update({ 
            is_pinned: !note.is_pinned,
            updated_at: newUpdatedAt
          })
          .eq('id', id);

        if (error) throw error;

        setNotes(currentNotes => 
          currentNotes.map(n => 
            n.id === id 
              ? { 
                  ...n, 
                  is_pinned: !n.is_pinned, 
                  updated_at: newUpdatedAt 
                } 
              : n
          ).sort((a, b) => {
            // Sort by pinned status first, then by updated_at
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          })
        );

        // Update selected note if it's the one being pinned
        if (selectedNote?.id === id) {
          setSelectedNote(prev => prev ? { ...prev, is_pinned: !prev.is_pinned } : null);
        }
      } catch (error) {
        console.error('Error toggling pin:', error);
      }
    }
  };

  const permanentlyDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error permanently deleting note:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sign in to Use Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create a free account to start taking notes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium 
                           hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 
                           focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Get Started
                </Link>
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="w-full sm:w-auto text-gray-600 dark:text-gray-400 px-6 py-2.5 rounded-lg 
                           font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h2>
            <button
              onClick={addNote}
              disabled={isSaving}
              className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded 
                       hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              New Note
            </button>
          </div>

          <div className="flex gap-6">
            {/* Notes List */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 pr-6">
              {/* Tab Navigation */}
              <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-4 py-2 -mb-px ${
                    activeTab === 'notes'
                      ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab('trash')}
                  className={`px-4 py-2 -mb-px flex items-center gap-1 ${
                    activeTab === 'trash'
                      ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                  Trash
                </button>
              </div>

              {/* Notes List */}
              <div className="space-y-2">
                {notes.map(note => (
                  <div
                    key={note.id}
                    className={`p-3 rounded cursor-pointer relative group ${
                      selectedNote?.id === note.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div onClick={() => setSelectedNote(note)}>
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {note.title || 'Untitled Note'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {note.content || 'No content'}
                      </p>
                    </div>
                    
                    {/* Action buttons */}
                    <div className={`absolute right-2 top-2 flex gap-1 ${
                      note.is_pinned 
                        ? 'opacity-100' // Always show for pinned notes
                        : 'opacity-0 group-hover:opacity-100' // Show on hover for unpinned notes
                      } transition-opacity`}
                    >
                      {activeTab === 'notes' ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(note.id);
                            }}
                            className="p-1 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400"
                          >
                            <Pin className={`h-4 w-4 ${
                              note.is_pinned ? 'text-indigo-600 dark:text-indigo-400' : ''
                            }`} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                            className={`p-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 ${
                              note.is_pinned ? 'opacity-0 group-hover:opacity-100' : ''
                            }`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              restoreNote(note.id);
                            }}
                            className="p-1 text-gray-400 hover:text-green-600 dark:text-gray-500 dark:hover:text-green-400"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              permanentlyDelete(note.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note Editor */}
            <div className="flex-1">
              {selectedNote ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => updateNote({ ...selectedNote, title: e.target.value })}
                    placeholder="Note title"
                    className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 
                             text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => updateNote({ ...selectedNote, content: e.target.value })}
                    placeholder="Start writing..."
                    className="w-full h-[calc(100vh-20rem)] bg-transparent border-none focus:ring-0 resize-none 
                             text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              ) : (
                <div className="h-[calc(100vh-16rem)] flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a note or create a new one
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 