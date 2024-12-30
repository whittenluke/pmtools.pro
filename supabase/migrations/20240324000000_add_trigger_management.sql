-- Create function to disable project-related triggers
CREATE OR REPLACE FUNCTION public.disable_project_triggers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  ALTER TABLE public.projects DISABLE TRIGGER log_project_activity;
  ALTER TABLE public.projects DISABLE TRIGGER log_projects_trigger;
END;
$$;

-- Create function to enable project-related triggers
CREATE OR REPLACE FUNCTION public.enable_project_triggers()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  ALTER TABLE public.projects ENABLE TRIGGER log_project_activity;
  ALTER TABLE public.projects ENABLE TRIGGER log_projects_trigger;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.disable_project_triggers TO authenticated;
GRANT EXECUTE ON FUNCTION public.enable_project_triggers TO authenticated; 