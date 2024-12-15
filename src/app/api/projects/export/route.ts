import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { projectId } = await request.json();
    if (!projectId) {
      return NextResponse.json(
        { error: 'No project ID provided' },
        { status: 400 }
      );
    }

    // Get project data with access verification
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        workspace:workspace_id (id, name),
        project_members:project_members (
          id,
          user_id,
          role
        )
      `)
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Get all related data
    const [
      { data: tasks },
      { data: groups },
      { data: comments },
      { data: projectViews }
    ] = await Promise.all([
      supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true }),
      supabase
        .from('groups')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true }),
      supabase
        .from('comments')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true }),
      supabase
        .from('project_views')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })
    ]);

    const exportData = {
      project,
      tasks: tasks || [],
      groups: groups || [],
      comments: comments || [],
      projectViews: projectViews || [],
      exportedAt: new Date().toISOString(),
      exportedBy: user.id
    };

    // Log the export
    await supabase.from('export_jobs').insert({
      project_id: projectId,
      exported_by: user.id,
      export_data: exportData,
      status: 'completed'
    });

    // Log activity
    await supabase.from('activity_log').insert({
      workspace_id: project.workspace_id,
      project_id: projectId,
      actor_id: user.id,
      activity_type: 'project_exported',
      activity_data: {
        export_time: exportData.exportedAt,
        data_types: ['tasks', 'groups', 'comments', 'project_views']
      }
    });

    return new NextResponse(JSON.stringify(exportData), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="project-${projectId}-export.json"`
      }
    });
  } catch (error) {
    console.error('Project export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
