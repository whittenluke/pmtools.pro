import { supabase } from '@/lib/supabase';
import type { Json } from '@/types/database';

interface AnalyticsEvent {
  event_name: string;
  properties: Json;
  created_at: string;
}

interface PageView {
  path: string;
  created_at: string;
}

export class AnalyticsService {
  static async trackEvent(
    eventName: string,
    properties: Record<string, any> = {}
  ) {
    try {
      const event: AnalyticsEvent = {
        event_name: eventName,
        properties: properties as Json,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
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
        .from('page_views')
        .insert(pageView);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }
}