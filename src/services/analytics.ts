import { supabase } from '@/lib/supabase';

export class AnalyticsService {
  static async trackEvent(
    eventName: string,
    properties: Record<string, any> = {}
  ) {
    try {
      const { error } = await supabase
        .from('analytics.events')
        .insert({
          event_name: eventName,
          properties,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  static async trackPageView(path: string) {
    try {
      const { error } = await supabase
        .from('analytics.page_views')
        .insert({
          path,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }
}