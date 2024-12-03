import { useState, useEffect } from 'react';
import { Plus, Search, Tag, Pin, PinOff, Trash2, Loader2 } from 'lucide-react';
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

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
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
      setShowAuthPrompt(true);
      return;
    }

    setIsSaving(true);
    try {
      const newNote = {
        title: '',
        content: '',
        tags: [],
        is_pinned: false,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('notes')
        .insert([newNote])
        .select()
        .single();

      if (error) throw error;
      
      setNotes([data, ...notes]);
      setSelectedNote(data);
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveNote = async (id: string, updates: Partial<Note>) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.map(note => 
        note.id === id 
          ? { ...note, ...updates, updated_at: new Date().toISOString() }
          : note
      ));

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
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== id));
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
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

            <div className="space-y-2">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-3 rounded cursor-pointer ${
                    selectedNote?.id === note.id
                      ? 'bg-indigo-50 border-indigo-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{note.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{note.content}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(note.id);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {note.is_pinned ? (
                        <Pin className="h-4 w-4" />
                      ) : (
                        <PinOff className="h-4 w-4" />
                      )}
                    </button>
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
                      saveNote(selectedNote.id, { title: newTitle });
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
                    saveNote(selectedNote.id, { content: newContent });
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