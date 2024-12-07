import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Loader2, Pin, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { useSupabase } from '../../lib/supabase/supabase-context';
import { Link } from 'react-router-dom';
import { debounce } from '../../lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  is_zen_mode?: boolean;
  is_saving?: boolean;
}

export function Notes() {
  const { supabase } = useSupabase();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'trash'>('notes');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [activeTab]);

  useEffect(() => {
    // Clear "saved" status after 2 seconds
    if (saveStatus === 'saved') {
      const timer = setTimeout(() => {
        setSaveStatus(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

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

        // Update selected note if it's the one being pinning
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

  // Update the debounce time constant
  const SAVE_DEBOUNCE_MS = 750;

  // Add immediate save function (for blur events)
  const saveNote = async (noteId: string, updates: Partial<Note>) => {
    setSaveStatus('saving');
    try {
      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', noteId);

      if (error) throw error;
      
      setNotes(notes => notes.map(note => 
        note.id === noteId ? { ...note, ...updates } : note
      ));
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving note:', error);
      setSaveStatus('error');
    }
  };

  // Update the handlers to include blur saves
  const handleTitleChange = (noteId: string, newTitle: string) => {
    setSaveStatus('saving');
    setSelectedNote(prev => 
      prev?.id === noteId ? { ...prev, title: newTitle } : prev
    );
    debouncedSaveTitle(noteId, newTitle);
  };

  const handleTitleBlur = (noteId: string, title: string) => {
    saveNote(noteId, { title });
  };

  const handleContentChange = (noteId: string, newContent: string) => {
    setSaveStatus('saving');
    setSelectedNote(prev => 
      prev?.id === noteId ? { ...prev, content: newContent } : prev
    );
    debouncedSaveContent(noteId, newContent);
  };

  const handleContentBlur = (noteId: string, content: string) => {
    saveNote(noteId, { content });
  };

  // Update the debounced functions with new timing
  const debouncedSaveTitle = useCallback(
    debounce(async (noteId: string, newTitle: string) => {
      saveNote(noteId, { title: newTitle });
    }, SAVE_DEBOUNCE_MS),
    [supabase]
  );

  const debouncedSaveContent = useCallback(
    debounce(async (noteId: string, newContent: string) => {
      saveNote(noteId, { content: newContent });
    }, SAVE_DEBOUNCE_MS),
    [supabase]
  );

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
                        {note.content ? note.content.slice(0, 100) : 'No content'}
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
            <div className={`transition-all duration-300 ease-in-out ${
              isZenMode ? 'fixed inset-0 bg-white dark:bg-gray-900 z-50' : 'flex-1'
            }`}>
              {selectedNote ? (
                <div className={`space-y-4 ${isZenMode ? 'max-w-3xl mx-auto p-8' : ''}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <input
                        type="text"
                        value={selectedNote.title}
                        onChange={(e) => handleTitleChange(selectedNote.id, e.target.value)}
                        onBlur={(e) => handleTitleBlur(selectedNote.id, e.target.value)}
                        placeholder="Note title"
                        className="flex-1 text-xl font-bold bg-transparent border-none outline-none 
                                 focus:outline-none focus:ring-0 hover:bg-gray-50 dark:hover:bg-gray-800/50
                                 focus:bg-gray-50 dark:focus:bg-gray-800/50 rounded px-2 -ml-2
                                 transition-colors duration-150 ease-in-out
                                 text-gray-900 dark:text-white placeholder-gray-400 
                                 dark:placeholder-gray-500"
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {(saveStatus || saveStatus === 'saved') && (
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
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsZenMode(!isZenMode)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                               dark:hover:text-gray-200 rounded-lg transition-colors"
                      title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                    >
                      {isZenMode ? 
                        <Minimize2 className="h-5 w-5" /> : 
                        <Maximize2 className="h-5 w-5" />
                      }
                    </button>
                  </div>
                  
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => handleContentChange(selectedNote.id, e.target.value)}
                    onBlur={(e) => handleContentBlur(selectedNote.id, e.target.value)}
                    placeholder="Start writing..."
                    className={`w-full bg-transparent border-none resize-none outline-none focus:outline-none focus:ring-0 
                              text-gray-900 dark:text-white placeholder-gray-400 
                              dark:placeholder-gray-500 ${
                                isZenMode 
                                  ? 'h-[calc(100vh-10rem)]'
                                  : 'h-[calc(100vh-24rem)]'
                              }`}
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