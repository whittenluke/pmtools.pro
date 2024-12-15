import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type SearchDocumentsArgs = Database['rpc']['search_documents']['Args'];
type SearchDocumentsReturns = Database['rpc']['search_documents']['Returns'][number];

export class SearchService {
  static async search(
    workspaceId: string,
    query: string,
    filters: Record<string, any> = {}
  ): Promise<SearchDocumentsReturns[]> {
    try {
      const { data, error } = await supabase.rpc('search_documents', {
        p_workspace_id: workspaceId,
        p_query: query,
        p_filters: filters,
      } satisfies SearchDocumentsArgs);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }
}