import { supabase } from '@/lib/supabase';

export class SearchService {
  static async search(query: string, filters: Record<string, any> = {}) {
    try {
      const { data, error } = await supabase
        .rpc('search.search_documents', {
          p_query: query,
          p_filters: filters,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }
}