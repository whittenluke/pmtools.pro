import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type Tables = Database['public']['Tables'];
type AnalyticsTables = Database['analytics']['Tables'];
type FeatureUsageInsert = AnalyticsTables['feature_usage']['Insert'];
type PageViewInsert = AnalyticsTables['page_views']['Insert'];

export interface AnalyticsEvent extends Omit<FeatureUsageInsert, 'created_at'> {
  feature_name: string;
  action: string;
  metadata?: Record<string, any>;
}

export interface PageView extends Omit<PageViewInsert, 'created_at'> {
  path: string;
  referrer?: string;
  user_agent?: string;
}

// Check analytics tables existence using RPC
const { data: analyticsEnabled } = await supabase
  .rpc('check_analytics_enabled');

export async function trackEvent(event: AnalyticsEvent) {
  try {
    const eventData: FeatureUsageInsert = {
      ...event,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .schema('analytics')
      .from('feature_usage')
      .insert([eventData]);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

export async function trackPageView(pageView: PageView) {
  try {
    const pageViewData: PageViewInsert = {
      ...pageView,
      created_at: new Date().toISOString()
    };

    const { error } = await supabase
      .schema('analytics')
      .from('page_views')
      .insert([pageViewData]);

    if (error) throw error;
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}