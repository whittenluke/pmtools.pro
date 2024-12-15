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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: 'No project ID provided' },
        { status: 400 }
      );
    }

    // Verify user has access to the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, workspace_id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${projectId}/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('project-files')
      .upload(filePath, file);

    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data } = await supabase
      .storage
      .from('project-files')
      .getPublicUrl(filePath);

    if (!data.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get file URL' },
        { status: 500 }
      );
    }

    // Log activity
    await supabase.from('activity_log').insert({
      workspace_id: project.workspace_id,
      project_id: projectId,
      actor_id: user.id,
      activity_type: 'file_uploaded',
      activity_data: {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_path: filePath
      }
    });

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
