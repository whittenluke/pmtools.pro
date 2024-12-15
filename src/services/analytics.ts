import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type AnalyticsEvent = Database['analytics']['Tables']['events']['Insert'];
type PageView = Database['analytics']['Tables']['page_views']['Insert'];

export class AnalyticsService {
  static async trackEvent(
    eventName: string,
    properties: Record<string, any> = {}
  ) {
    try {
      const event: AnalyticsEvent = {
        event_name: eventName,
        properties,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .schema('analytics')
        .from('events')
        .insert(event);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  static async trackPageView(path: string) {
    try {
      const pageView: PageView = {
        path,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .schema('analytics')
        .from('page_views')
        .insert(pageView);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }
}