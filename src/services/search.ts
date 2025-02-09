import { supabase } from '@/lib/supabase';
import type { Json } from '@/types/database';

interface SearchResult {
  id: string;
  type: 'task' | 'project' | 'comment';
  title: string;
  content: string;
  metadata: Json;
}

export class SearchService {
  static async search(
    workspaceId: string,
    query: string,
    filters: Record<string, any> = {}
  ): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase.rpc('search_documents', {
        p_workspace_id: workspaceId,
        p_query: query,
        p_filters: filters as Json
      });

      if (error) throw error;
      return data as SearchResult[];
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }
}