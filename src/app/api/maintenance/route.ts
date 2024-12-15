import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Maintenance tasks will be triggered by a cron job
export async function POST(request: Request) {
  try {
    // Verify the request is from our cron job
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ') || authHeader.split(' ')[1] !== process.env.MAINTENANCE_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    const operations = [];

    // Clean up old notifications (30 days)
    operations.push(
      supabase
        .from('notifications')
        .delete()
        .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .is('read_at', 'not null')
    );

    // Archive old activity logs (90 days)
    operations.push(
      supabase
        .from('activity_log')
        .update({ archived: true })
        .lt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .is('archived', 'null')
    );

    // Clean up expired workspace invites
    operations.push(
      supabase
        .from('workspace_invites')
        .delete()
        .lt('expires_at', new Date().toISOString())
    );

    // Clean up old automation logs (30 days)
    operations.push(
      supabase
        .from('automation_logs')
        .delete()
        .lt('executed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    );

    // Clean up old export jobs (7 days)
    operations.push(
      supabase
        .from('export_jobs')
        .delete()
        .lt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    );

    // Run all cleanup operations
    await Promise.all(operations);

    // Run VACUUM ANALYZE on important tables
    await supabase.rpc('maintenance_vacuum_analyze', {
      tables: ['tasks', 'comments', 'activity_log', 'notifications']
    });

    return NextResponse.json({
      message: 'Maintenance completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Maintenance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
