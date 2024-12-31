-- Function to safely delete a project and all related data
CREATE OR REPLACE FUNCTION public.delete_project(project_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    project_record projects%ROWTYPE;
BEGIN
    -- Start transaction
    BEGIN
        -- Get project info for audit log
        SELECT * INTO project_record
        FROM projects
        WHERE id = project_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Project not found';
        END IF;

        -- Create final audit log entry
        INSERT INTO activity_log (
            action,
            project_id,
            user_id,
            details
        ) VALUES (
            'project.deleted',
            project_id,
            auth.uid(),
            jsonb_build_object(
                'project_title', project_record.title,
                'project_description', project_record.description,
                'deleted_at', now(),
                'deleted_by', auth.uid()
            )
        );

        -- Delete related data in correct order
        DELETE FROM activity_log WHERE project_id = project_id;
        DELETE FROM comments WHERE task_id IN (SELECT id FROM tasks WHERE project_id = project_id);
        DELETE FROM tasks WHERE project_id = project_id;
        DELETE FROM project_views WHERE project_id = project_id;
        DELETE FROM groups WHERE project_id = project_id;
        DELETE FROM automations WHERE project_id = project_id;
        DELETE FROM tables WHERE project_id = project_id;
        
        -- Finally delete the project
        DELETE FROM projects WHERE id = project_id;

        -- Commit transaction
        COMMIT;
    EXCEPTION WHEN OTHERS THEN
        -- Rollback transaction on error
        ROLLBACK;
        RAISE;
    END;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_project TO authenticated;

-- Add policy to control who can execute the delete function
CREATE POLICY "Allow project managers to delete projects"
    ON public.projects
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = projects.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin', 'manager')
        )
    ); 