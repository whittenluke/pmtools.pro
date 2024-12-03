import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Tag, Pin, Trash2, Loader2, RotateCcw } from 'lucide-react';
import { useSupabase } from '../../lib/supabase/supabase-context';
import { useNavigate } from 'react-router-dom';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'notes' | 'trash'>('notes');

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
      
      setNotes(currentNotes => [data, ...currentNotes]);
      setSelectedNote(data);
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (id: string, updates: Partial<Note>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          saveNote(id, updates);
        }, 1000); // Wait 1 second after last keystroke before saving
      };
    })(),
    []
  );

  const saveNote = async (id: string, updates: Partial<Note>) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setNotes(currentNotes => 
        currentNotes.map(note => 
          note.id === id 
            ? { ...note, ...updates, updated_at: new Date().toISOString() }
            : note
        )
      );

      if (selectedNote?.id === id) {
        setSelectedNote(prev => prev ? { ...prev, ...updates } : null);
      }
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
          deleted_at: null
        })
        .eq('id', id);

      if (error) throw error;
      
      if (activeTab === 'trash') {
        setNotes(notes.filter(note => note.id !== id));
        if (selectedNote?.id === id) {
          setSelectedNote(null);
        }
      }
    } catch (error) {
      console.error('Error restoring note:', error);
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

  const togglePin = async (id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      await saveNote(id, { is_pinned: !note.is_pinned });
    }
  };

  const addTag = async (noteId: string) => {
    if (!newTag.trim()) return;
    const note = notes.find(n => n.id === noteId);
    if (note && !note.tags.includes(newTag)) {
      await saveNote(noteId, { tags: [...note.tags, newTag.trim()] });
    }
    setNewTag('');
  };

  const removeTag = async (noteId: string, tagToRemove: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      await saveNote(noteId, { 
        tags: note.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sign in to Create Notes
              </h3>
              <p className="text-gray-600 mb-6">
                Create a free account to start taking notes and access them from anywhere. Your notes will be private and securely stored.
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
      )}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Notes</h2>
          <button
            onClick={addNote}
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
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
          <div className="w-1/3 border-r pr-6">
            {/* Tab Navigation */}
            <div className="flex mb-4 border-b">
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 -mb-px ${
                  activeTab === 'notes'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('trash')}
                className={`px-4 py-2 -mb-px flex items-center gap-1 ${
                  activeTab === 'trash'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                Trash
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-300px)]">
              {activeTab === 'trash' && (
                <p className="text-sm text-gray-500 mb-4">
                  Notes in trash will be permanently deleted after 3 days
                </p>
              )}
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedNote?.id === note.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium truncate">{note.title || 'Untitled Note'}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{note.content}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      {activeTab === 'notes' ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(note.id);
                            }}
                            className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                              note.is_pinned ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            <Pin className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"
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
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              permanentlyDelete(note.id);
                            }}
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Note Editor */}
          <div className="flex-1">
            {selectedNote ? (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setSelectedNote(prev => prev ? { ...prev, title: newTitle } : null);
                      debouncedSave(selectedNote.id, { title: newTitle });
                    }}
                    placeholder="Untitled Note"
                    className="text-xl font-bold bg-transparent border-none focus:ring-0 p-0 w-full placeholder-gray-400"
                  />
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag(selectedNote.id)}
                    placeholder="Add tag..."
                    className="text-sm border-none focus:ring-0 p-0 placeholder-gray-400"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedNote.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(selectedNote.id, tag)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <textarea
                  value={selectedNote.content}
                  onChange={(e) => {
                    const newContent = e.target.value;
                    setSelectedNote(prev => prev ? { ...prev, content: newContent } : null);
                    debouncedSave(selectedNote.id, { content: newContent });
                  }}
                  className="w-full h-[calc(100vh-400px)] p-4 border rounded focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Start writing..."
                />

                <div className="flex justify-end text-sm text-gray-500">
                  {isSaving ? 'Saving...' : 'All changes saved'}
                </div>
              </div>
            ) : (
              <div className="h-[calc(100vh-400px)] flex items-center justify-center text-gray-400">
                Select a note or create a new one
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 