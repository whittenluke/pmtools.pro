import { supabase } from '@/lib/supabase';
import type { Json } from '@/types/database';

interface SearchResult {
  task_id: string;
  title: string;
  description: string;
  rank: number;
}

export async function searchTasks(query: string, projectId?: string): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase.rpc('search_tasks', {
      search_query: query,
      project_id: projectId
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export class SearchService {
  static async search(
    workspaceId: string,
    query: string,
    filters: Record<string, any> = {}
  ): Promise<SearchResult[]> {
    try {
      const { data, error } = await supabase.rpc('search_workspace_content', {
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