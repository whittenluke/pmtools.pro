import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type SearchDocumentsArgs = Parameters<Database['rpc']['search_documents']>[0];
type SearchDocumentsReturns = Awaited<ReturnType<Database['rpc']['search_documents']>>[number];

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