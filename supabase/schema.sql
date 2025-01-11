-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgjwt";
CREATE EXTENSION IF NOT EXISTS "pgsodium";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS integrations;

-- Analytics schema tables
CREATE TABLE IF NOT EXISTS analytics.daily_active_users (
    active_workspaces bigint,
    active_users bigint,
    date timestamp with time zone
);

CREATE TABLE IF NOT EXISTS analytics.feature_usage (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    action text NOT NULL,
    feature_name text NOT NULL,
    workspace_id uuid,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS analytics.page_views (
    user_agent text,
    created_at timestamp with time zone DEFAULT now(),
    duration integer,
    workspace_id uuid,
    user_id uuid,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    referrer text,
    path text NOT NULL,
    session_id text,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS analytics.performance_metrics (
    metric_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    workspace_id uuid,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS analytics.system_health (
    total_workspaces bigint,
    total_tasks bigint,
    storage_usage json,
    total_projects bigint,
    total_users bigint
);

-- Billing schema tables
CREATE TABLE IF NOT EXISTS billing.plans (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    features jsonb NOT NULL,
    name text NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    is_public boolean DEFAULT true,
    price_yearly integer NOT NULL,
    price_monthly integer NOT NULL,
    limits jsonb NOT NULL,
    description text,
    code text NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS billing.subscriptions (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    status text NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb,
    cancel_at_period_end boolean DEFAULT false,
    current_period_end timestamp with time zone NOT NULL,
    current_period_start timestamp with time zone NOT NULL,
    plan_id uuid,
    workspace_id uuid,
    payment_method_id text,
    PRIMARY KEY (id),
    FOREIGN KEY (plan_id) REFERENCES billing.plans(id)
);

CREATE TABLE IF NOT EXISTS billing.invoices (
    billing_reason text,
    invoice_pdf text,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    subscription_id uuid,
    workspace_id uuid,
    amount integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    stripe_payment_intent_id text,
    stripe_invoice_id text,
    status text NOT NULL,
    currency text NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (subscription_id) REFERENCES billing.subscriptions(id)
);

CREATE TABLE IF NOT EXISTS billing.usage_records (
    quantity integer NOT NULL,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    workspace_id uuid,
    metric text NOT NULL,
    subscription_id uuid,
    recorded_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (subscription_id) REFERENCES billing.subscriptions(id)
);

-- Integrations schema tables
CREATE TABLE IF NOT EXISTS integrations.providers (
    config_schema jsonb NOT NULL,
    code text NOT NULL,
    auth_type text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_enabled boolean DEFAULT true,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS integrations.workspace_integrations (
    error_message text,
    name text NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    last_sync_at timestamp with time zone,
    config jsonb NOT NULL,
    provider_id uuid,
    workspace_id uuid,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    status text NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (provider_id) REFERENCES integrations.providers(id)
);

CREATE TABLE IF NOT EXISTS integrations.webhooks (
    last_triggered_at timestamp with time zone,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    integration_id uuid,
    enabled boolean DEFAULT true,
    failure_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    url text NOT NULL,
    event_type text NOT NULL,
    secret text NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (integration_id) REFERENCES integrations.workspace_integrations(id)
);

-- Public schema tables
CREATE TABLE IF NOT EXISTS public.workspaces (
    branding jsonb DEFAULT '{}'::jsonb,
    settings jsonb DEFAULT '{}'::jsonb,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    features jsonb DEFAULT '{}'::jsonb,
    slug text NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    limits jsonb DEFAULT '{}'::jsonb,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.workspace_members (
    role text NOT NULL,
    permissions jsonb DEFAULT '{}'::jsonb,
    user_id uuid NOT NULL,
    joined_at timestamp with time zone DEFAULT now(),
    workspace_id uuid NOT NULL,
    PRIMARY KEY (user_id, workspace_id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

CREATE TABLE IF NOT EXISTS public.workspace_invites (
    role text NOT NULL,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    workspace_id uuid,
    invited_by uuid,
    expires_at timestamp with time zone NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

CREATE TABLE IF NOT EXISTS public.projects (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    title text NOT NULL,
    description text,
    created_by uuid,
    settings jsonb DEFAULT '{}'::jsonb,
    workspace_id uuid,
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

CREATE TABLE IF NOT EXISTS public.project_views (
    title text NOT NULL,
    type text,
    updated_at timestamp with time zone DEFAULT now(),
    project_id uuid,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    status_config jsonb DEFAULT '{"statuses": [{"id": "not_started", "type": "default", "color": "#c4c4c4", "title": "Not Started", "position": 0}, {"id": "in_progress", "type": "default", "color": "#fdab3d", "title": "In Progress", "position": 1}, {"id": "done", "type": "default", "color": "#00c875", "title": "Done", "position": 2}], "defaultStatusId": "not_started"}'::jsonb,
    columns jsonb DEFAULT '[]'::jsonb,
    config jsonb DEFAULT '{}'::jsonb,
    is_default boolean DEFAULT false,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

CREATE TABLE IF NOT EXISTS public.tables (
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    title text NOT NULL,
    color text,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    project_id uuid,
    position integer NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES public.projects(id)
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    project_id uuid,
    table_id uuid,
    title text NOT NULL,
    description text,
    status_id text NOT NULL DEFAULT 'not_started'::text,
    assignee_id uuid,
    due_date timestamp with time zone,
    position integer NOT NULL,
    column_values jsonb DEFAULT '{}'::jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    search_text tsvector,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES public.projects(id),
    FOREIGN KEY (table_id) REFERENCES public.tables(id)
);

CREATE TABLE IF NOT EXISTS public.comments (
    user_id uuid,
    is_resolved boolean DEFAULT false,
    attachments jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    search_text tsvector,
    content text NOT NULL,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    task_id uuid,
    PRIMARY KEY (id),
    FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);

CREATE TABLE IF NOT EXISTS public.activity_log (
    created_at timestamp with time zone DEFAULT now(),
    action text NOT NULL,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    project_id uuid,
    task_id uuid,
    user_id uuid,
    details jsonb NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES public.projects(id),
    FOREIGN KEY (task_id) REFERENCES public.tasks(id)
);

CREATE TABLE IF NOT EXISTS public.automations (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    trigger jsonb NOT NULL,
    name text NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    project_id uuid,
    workspace_id uuid,
    enabled boolean DEFAULT true,
    actions jsonb NOT NULL,
    conditions jsonb DEFAULT '[]'::jsonb,
    description text,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES public.projects(id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

CREATE TABLE IF NOT EXISTS public.automation_logs (
    automation_id uuid,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    trigger_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    details jsonb NOT NULL,
    status text NOT NULL,
    error text,
    PRIMARY KEY (id),
    FOREIGN KEY (automation_id) REFERENCES public.automations(id)
);

CREATE TABLE IF NOT EXISTS public.export_jobs (
    config jsonb NOT NULL,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    workspace_id uuid,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status text NOT NULL,
    format text NOT NULL,
    file_url text,
    error text,
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

CREATE TABLE IF NOT EXISTS public.import_jobs (
    error text,
    source text NOT NULL,
    config jsonb NOT NULL,
    progress integer DEFAULT 0,
    total integer,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    workspace_id uuid,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    status text NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

CREATE TABLE IF NOT EXISTS public.permission_sets (
    name text NOT NULL,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    permissions jsonb NOT NULL,
    is_custom boolean DEFAULT false,
    priority integer NOT NULL,
    workspace_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    description text,
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

CREATE TABLE IF NOT EXISTS public.resource_permissions (
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    grantee_type text NOT NULL,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    resource_id uuid NOT NULL,
    resource_type text NOT NULL,
    permission_set_id uuid,
    workspace_id uuid,
    grantee_id uuid NOT NULL,
    conditions jsonb DEFAULT '[]'::jsonb,
    PRIMARY KEY (id),
    FOREIGN KEY (permission_set_id) REFERENCES public.permission_sets(id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    full_name text,
    bio text,
    avatar_url text,
    updated_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.project_templates (
    updated_at timestamp with time zone DEFAULT now(),
    workspace_id uuid,
    is_public boolean DEFAULT false,
    title text NOT NULL,
    description text,
    config jsonb NOT NULL,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
    metadata jsonb DEFAULT '{}'::jsonb,
    workspace_id uuid,
    link text,
    content text,
    title text NOT NULL,
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    read_at timestamp with time zone,
    project_id uuid,
    type text NOT NULL,
    user_id uuid,
    PRIMARY KEY (id),
    FOREIGN KEY (project_id) REFERENCES public.projects(id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);

-- Function: handle_new_user_setup
CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  workspace_id uuid;
  debug_info jsonb;
BEGIN
  -- Create debug info object
  debug_info := jsonb_build_object(
    'user_id', new.id,
    'email', new.email,
    'raw_user_meta_data', new.raw_user_meta_data
  );

  -- Create profile
  INSERT INTO public.profiles (
    id,
    full_name,
    avatar_url,
    updated_at
  ) VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    ),
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      null
    ),
    now()
  );

  -- Create workspace
  INSERT INTO workspaces (name, slug)
  VALUES ('My Workspace', 'my-workspace-' || new.id)
  RETURNING id INTO workspace_id;

  -- Create workspace membership
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (workspace_id, new.id, 'owner');

  -- Verify the workspace membership was created
  IF NOT EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE workspace_id = workspace_id 
    AND user_id = new.id 
    AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Failed to create workspace membership for user %', new.id;
  END IF;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log the full error with context
  RAISE WARNING 'Error in handle_new_user_setup: % Context: %', SQLERRM, debug_info;
  -- Re-raise the error to ensure it's not silently ignored
  RAISE;
END;
$$;

-- Function: check_rls_status
CREATE OR REPLACE FUNCTION public.check_rls_status()
RETURNS TABLE(schema_name text, table_name text, rls_enabled boolean)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT n.nspname::text as schema_name,
         c.relname::text as table_name,
         c.relrowsecurity as rls_enabled
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind = 'r'  -- Only regular tables
  AND n.nspname IN ('public', 'analytics', 'billing', 'integrations')
  ORDER BY n.nspname, c.relname;
END;
$$;

-- Function: check_table_policies
CREATE OR REPLACE FUNCTION public.check_table_policies()
RETURNS TABLE(schema_name text, table_name text, policy_count bigint)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT n.nspname::text as schema_name,
         c.relname::text as table_name,
         COUNT(p.polname)::bigint as policy_count
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  LEFT JOIN pg_policy p ON p.polrelid = c.oid
  WHERE c.relkind = 'r'  -- Only regular tables
  AND n.nspname IN ('public', 'analytics', 'billing', 'integrations')
  GROUP BY n.nspname, c.relname
  ORDER BY n.nspname, c.relname;
END;
$$;

-- Function: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Function: log_page_view
CREATE OR REPLACE FUNCTION public.log_page_view(
    path text,
    workspace_id uuid DEFAULT NULL::uuid,
    referrer text DEFAULT NULL::text,
    user_agent text DEFAULT NULL::text,
    session_id text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    view_id UUID;
BEGIN
    INSERT INTO analytics.page_views (
        user_id,
        workspace_id,
        path,
        referrer,
        user_agent,
        session_id
    ) VALUES (
        auth.uid(),
        workspace_id,
        path,
        referrer,
        user_agent,
        session_id
    )
    RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$$;

-- Function: log_feature_usage
CREATE OR REPLACE FUNCTION public.log_feature_usage(
    feature_name text,
    action text,
    workspace_id uuid DEFAULT NULL::uuid,
    metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    usage_id UUID;
BEGIN
    INSERT INTO analytics.feature_usage (
        user_id,
        workspace_id,
        feature_name,
        action,
        metadata
    ) VALUES (
        auth.uid(),
        workspace_id,
        feature_name,
        action,
        metadata
    )
    RETURNING id INTO usage_id;
    
    RETURN usage_id;
END;
$$;

-- Function: log_performance_metric
CREATE OR REPLACE FUNCTION public.log_performance_metric(
    metric_name text,
    value double precision,
    workspace_id uuid DEFAULT NULL::uuid,
    metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    metric_id UUID;
BEGIN
    INSERT INTO analytics.performance_metrics (
        user_id,
        workspace_id,
        metric_name,
        value,
        metadata
    ) VALUES (
        auth.uid(),
        workspace_id,
        metric_name,
        value,
        metadata
    )
    RETURNING id INTO metric_id;
    
    RETURN metric_id;
END;
$$;

-- Function: search_tasks
CREATE OR REPLACE FUNCTION public.search_tasks(
    search_query text,
    project_id uuid DEFAULT NULL::uuid
)
RETURNS TABLE(task_id uuid, title text, description text, rank real)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id as task_id,
        t.title,
        t.description,
        ts_rank(t.search_text, websearch_to_tsquery('public.english_unaccent', search_query)) as rank
    FROM tasks t
    WHERE 
        t.search_text @@ websearch_to_tsquery('public.english_unaccent', search_query)
        AND (project_id IS NULL OR t.project_id = project_id)
    ORDER BY rank DESC;
END;
$$;

-- Function: is_workspace_member
CREATE OR REPLACE FUNCTION public.is_workspace_member(
    workspace_id uuid,
    user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = $1
        AND workspace_members.user_id = $2
    );
END;
$$;

-- Function: get_user_workspace_role
CREATE OR REPLACE FUNCTION public.get_user_workspace_role(
    workspace_id uuid,
    user_id uuid DEFAULT auth.uid()
)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT role FROM workspace_members
        WHERE workspace_members.workspace_id = $1
        AND workspace_members.user_id = $2
    );
END;
$$;

-- Function: can_access_project
CREATE OR REPLACE FUNCTION public.can_access_project(
    project_id uuid,
    user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        WHERE p.id = $1
        AND wm.user_id = $2
    );
END;
$$;

-- Function: move_task
CREATE OR REPLACE FUNCTION public.move_task(
    task_id uuid,
    new_group_id uuid,
    new_position integer,
    user_id uuid DEFAULT auth.uid()
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    old_group_id UUID;
    max_position INTEGER;
BEGIN
    -- Check permission
    IF NOT EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        JOIN tasks t ON t.project_id = p.id
        WHERE t.id = task_id
        AND wm.user_id = user_id
        AND wm.role IN ('owner', 'admin', 'manager', 'editor')
    ) THEN
        RAISE EXCEPTION 'Permission denied';
    END IF;

    -- Get current group
    SELECT table_id INTO old_group_id FROM tasks WHERE id = task_id;

    -- Get max position in new group
    SELECT COALESCE(MAX(position), 0) INTO max_position
    FROM tasks WHERE table_id = new_group_id;

    -- Ensure new_position is valid
    IF new_position > max_position + 1 THEN
        new_position := max_position + 1;
    END IF;

    -- Update positions in old group
    IF old_group_id IS NOT NULL THEN
        UPDATE tasks
        SET position = position - 1
        WHERE table_id = old_group_id
        AND position > (SELECT position FROM tasks WHERE id = task_id);
    END IF;

    -- Update positions in new group
    UPDATE tasks
    SET position = position + 1
    WHERE table_id = new_group_id
    AND position >= new_position;

    -- Move the task
    UPDATE tasks
    SET table_id = new_group_id,
        position = new_position
    WHERE id = task_id;
END;
$$;

-- Function: get_workspace_member_count
CREATE OR REPLACE FUNCTION public.get_workspace_member_count(workspace_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) FROM workspace_members
        WHERE workspace_members.workspace_id = $1
    );
END;
$$;

-- Function: search_comments
CREATE OR REPLACE FUNCTION public.search_comments(
    search_query text,
    project_id uuid DEFAULT NULL::uuid
)
RETURNS TABLE(comment_id uuid, content text, task_id uuid, rank real)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as comment_id,
        c.content,
        c.task_id,
        ts_rank(c.search_text, websearch_to_tsquery('public.english_unaccent', search_query)) as rank
    FROM comments c
    JOIN tasks t ON c.task_id = t.id
    WHERE 
        c.search_text @@ websearch_to_tsquery('public.english_unaccent', search_query)
        AND (project_id IS NULL OR t.project_id = project_id)
    ORDER BY rank DESC;
END;
$$;

-- Function: log_activity
CREATE OR REPLACE FUNCTION public.log_activity()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_project_id uuid;
    v_task_id uuid;
    v_details jsonb;
BEGIN
    IF TG_TABLE_NAME = 'projects' THEN
        v_project_id := NEW.id;
        v_details := jsonb_build_object(
            'old_data', to_jsonb(OLD),
            'new_data', to_jsonb(NEW)
        );
    ELSIF TG_TABLE_NAME = 'tasks' THEN
        v_project_id := NEW.project_id;
        v_task_id := NEW.id;
        v_details := jsonb_build_object(
            'old_data', to_jsonb(OLD),
            'new_data', to_jsonb(NEW)
        );
    ELSIF TG_TABLE_NAME = 'comments' THEN
        SELECT project_id INTO v_project_id
        FROM tasks
        WHERE id = NEW.task_id;
        v_task_id := NEW.task_id;
        v_details := jsonb_build_object(
            'old_data', to_jsonb(OLD),
            'new_data', to_jsonb(NEW)
        );
    ELSIF TG_TABLE_NAME = 'tables' THEN
        v_project_id := NEW.project_id;
        v_details := jsonb_build_object(
            'old_data', to_jsonb(OLD),
            'new_data', to_jsonb(NEW)
        );
    END IF;

    INSERT INTO activity_log (
        action,
        project_id,
        task_id,
        user_id,
        details
    ) VALUES (
        TG_OP,
        v_project_id,
        v_task_id,
        COALESCE(NEW.user_id, auth.uid()),
        v_details
    );

    RETURN NEW;
END;
$$;

-- Function: process_automation_rules
CREATE OR REPLACE FUNCTION public.process_automation_rules()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    automation_rule RECORD;
    conditions_met BOOLEAN;
    action_data jsonb;
BEGIN
    -- Determine trigger type based on operation and changes
    FOR automation_rule IN 
        SELECT a.* 
        FROM automations a
        WHERE a.project_id = NEW.project_id
        AND a.enabled = true
    LOOP
        conditions_met := true;
        
        -- Evaluate conditions based on trigger type
        IF automation_rule.conditions IS NOT NULL THEN
            -- Example condition: status changed to specific value
            IF automation_rule.trigger->>'type' = 'task_status_changed' AND 
               OLD.status_id <> NEW.status_id AND
               automation_rule.conditions->>'status_id' = NEW.status_id THEN
                conditions_met := true;
            -- Add more condition evaluations here
            ELSE
                conditions_met := false;
            END IF;
        END IF;

        -- If conditions are met, execute the automation action
        IF conditions_met THEN
            action_data := jsonb_build_object(
                'task_id', NEW.id,
                'automation_id', automation_rule.id,
                'trigger_type', automation_rule.trigger->>'type',
                'action', automation_rule.actions,
                'triggered_by', auth.uid(),
                'triggered_at', now()
            );

            -- Execute the actions
            FOR action IN SELECT * FROM jsonb_array_elements(automation_rule.actions)
            LOOP
                CASE action->>'type'
                    WHEN 'assign_task' THEN
                        UPDATE tasks 
                        SET assignee_id = (action->>'assignee_id')::uuid
                        WHERE id = NEW.id;
                    
                    WHEN 'update_status' THEN
                        UPDATE tasks 
                        SET status_id = action->>'status_id'
                        WHERE id = NEW.id;
                    
                    WHEN 'add_comment' THEN
                        INSERT INTO comments (task_id, content, user_id)
                        VALUES (
                            NEW.id,
                            action->>'comment_text',
                            auth.uid()
                        );
                    
                    WHEN 'send_notification' THEN
                        -- Placeholder for notification system integration
                        -- Will be implemented when notification system is added
                        NULL;
                END CASE;
            END LOOP;

            -- Log the automation execution
            INSERT INTO automation_logs (
                automation_id,
                trigger_type,
                details,
                status
            ) VALUES (
                automation_rule.id,
                automation_rule.trigger->>'type',
                action_data,
                'completed'
            );
        END IF;
    END LOOP;

    RETURN NEW;
END;
$function$;

-- Function: check_due_date_automations
CREATE OR REPLACE FUNCTION public.check_due_date_automations()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    task RECORD;
BEGIN
    FOR task IN 
        SELECT t.* 
        FROM tasks t
        WHERE t.due_date IS NOT NULL
        AND t.due_date > now()
        AND t.due_date <= now() + interval '24 hours'
    LOOP
        -- Trigger automation rules for due_date_approaching
        -- This will be called by a scheduled job
        UPDATE tasks 
        SET last_due_date_check = now()
        WHERE id = task.id;
    END LOOP;
END;
$$;

-- Function: send_notification
CREATE OR REPLACE FUNCTION public.send_notification(
    p_user_id uuid,
    p_workspace_id uuid,
    p_project_id uuid,
    p_type text,
    p_title text,
    p_content text DEFAULT NULL::text,
    p_link text DEFAULT NULL::text,
    p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
    notification_id uuid;
BEGIN
    INSERT INTO notifications (
        user_id,
        workspace_id,
        project_id,
        type,
        title,
        content,
        link,
        metadata
    ) VALUES (
        p_user_id,
        p_workspace_id,
        p_project_id,
        p_type,
        p_title,
        p_content,
        p_link,
        p_metadata
    )
    RETURNING id INTO notification_id;

    RETURN notification_id;
END;
$$;

-- Function: mark_notifications_read
CREATE OR REPLACE FUNCTION public.mark_notifications_read(p_notification_ids uuid[])
RETURNS SETOF uuid
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    UPDATE notifications
    SET read_at = now()
    WHERE id = ANY(p_notification_ids)
    AND user_id = auth.uid()
    AND read_at IS NULL
    RETURNING id;
END;
$$;

-- Function: maintenance_vacuum_analyze
CREATE OR REPLACE FUNCTION public.maintenance_vacuum_analyze(tables text[])
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        EXECUTE format('VACUUM ANALYZE %I', table_name);
    END LOOP;
END;
$$;

-- Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_setup();

CREATE TRIGGER log_comment_activity
    AFTER INSERT OR DELETE OR UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_comments_trigger
    AFTER INSERT OR DELETE OR UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_group_activity
    AFTER INSERT OR DELETE OR UPDATE ON public.tables
    FOR EACH ROW
    EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_project_activity
    AFTER INSERT OR DELETE OR UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_projects_trigger
    AFTER INSERT OR DELETE OR UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION log_activity();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER log_task_activity
    AFTER INSERT OR DELETE OR UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_tasks_trigger
    AFTER INSERT OR DELETE OR UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION log_activity();

CREATE TRIGGER task_automation_trigger
    AFTER UPDATE ON public.tasks
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION process_automation_rules();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at
    BEFORE UPDATE ON public.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE analytics.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations.workspace_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permission_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Analytics Schema Policies
CREATE POLICY "System can insert feature usage" ON analytics.feature_usage
    FOR INSERT TO public
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own feature usage" ON analytics.feature_usage
    FOR SELECT TO public
    USING (user_id = auth.uid());

CREATE POLICY "Workspace admins can view workspace feature usage" ON analytics.feature_usage
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = feature_usage.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = ANY (ARRAY['owner', 'admin'])
    ));

CREATE POLICY "System can insert analytics data" ON analytics.page_views
    FOR INSERT TO public
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own page views" ON analytics.page_views
    FOR SELECT TO public
    USING (user_id = auth.uid());

CREATE POLICY "Workspace admins can view workspace page views" ON analytics.page_views
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = page_views.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = ANY (ARRAY['owner', 'admin'])
    ));

CREATE POLICY "System can insert performance metrics" ON analytics.performance_metrics
    FOR INSERT TO public
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Workspace admins can view workspace performance metrics" ON analytics.performance_metrics
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = performance_metrics.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = ANY (ARRAY['owner', 'admin'])
    ));

-- Billing Schema Policies
CREATE POLICY "Workspace admins can view invoices" ON billing.invoices
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = invoices.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = ANY (ARRAY['owner', 'admin'])
    ));

CREATE POLICY "Workspace owners can manage invoices" ON billing.invoices
    FOR ALL TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = invoices.workspace_id
        AND wm.user_id = auth.uid()
        AND wm.role = 'owner'
    ));

CREATE POLICY "Public plans are viewable by all authenticated users" ON billing.plans
    FOR SELECT TO public
    USING (is_public = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Workspace admins can view all plans" ON billing.plans
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.user_id = auth.uid()
        AND workspace_members.role = ANY (ARRAY['owner', 'admin'])
    ));

CREATE POLICY "Workspace admins can view subscriptions" ON billing.subscriptions
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = subscriptions.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = ANY (ARRAY['owner', 'admin'])
    ));

CREATE POLICY "Workspace owners can manage subscriptions" ON billing.subscriptions
    FOR ALL TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = subscriptions.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = 'owner'
    ));

CREATE POLICY "System can insert usage records" ON billing.usage_records
    FOR INSERT TO public
    WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = usage_records.workspace_id
        AND workspace_members.user_id = auth.uid()
    ));

CREATE POLICY "Workspace admins can view usage records" ON billing.usage_records
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = usage_records.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = ANY (ARRAY['owner', 'admin'])
    ));

-- Integrations Schema Policies
CREATE POLICY "Enabled providers are viewable by all authenticated users" ON integrations.providers
    FOR SELECT TO public
    USING (is_enabled = true AND auth.uid() IS NOT NULL);

CREATE POLICY "System admins can manage providers" ON integrations.providers
    FOR ALL TO public
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE users.id = auth.uid()
        AND (users.raw_app_meta_data->>'is_system_admin')::text = 'true'
    ));

CREATE POLICY "Integration owners can manage webhooks" ON integrations.webhooks
    FOR ALL TO public
    USING (EXISTS (
        SELECT 1 FROM integrations.workspace_integrations wi
        JOIN workspace_members wm ON wm.workspace_id = wi.workspace_id
        WHERE wi.id = webhooks.integration_id
        AND wm.user_id = auth.uid()
        AND wm.role = ANY (ARRAY['owner', 'admin'])
    ));

CREATE POLICY "Integration owners can view webhooks" ON integrations.webhooks
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM integrations.workspace_integrations wi
        JOIN workspace_members wm ON wm.workspace_id = wi.workspace_id
        WHERE wi.id = webhooks.integration_id
        AND wm.user_id = auth.uid()
        AND wm.role = ANY (ARRAY['owner', 'admin'])
    ));

CREATE POLICY "Workspace admins can manage integrations" ON integrations.workspace_integrations
    FOR ALL TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = workspace_integrations.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = ANY (ARRAY['owner', 'admin'])
    ));

CREATE POLICY "Workspace members can view integrations" ON integrations.workspace_integrations
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = workspace_integrations.workspace_id
        AND workspace_members.user_id = auth.uid()
    ));

-- Public Schema Policies
CREATE POLICY "Project members can view activity log" ON public.activity_log
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        WHERE p.id = activity_log.project_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "System can manage activity log" ON public.activity_log
    FOR ALL TO public
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        WHERE p.id = activity_log.project_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "Default deny policy" ON public.automation_logs
    FOR ALL TO public
    USING (false);

CREATE POLICY "Project members can view automation logs" ON public.automation_logs
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        JOIN automations a ON a.project_id = p.id
        WHERE a.id = automation_logs.automation_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "Default deny policy" ON public.automations
    FOR ALL TO public
    USING (false);

CREATE POLICY "Project members can view automations" ON public.automations
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        WHERE p.id = automations.project_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "Comment owners can manage their comments" ON public.comments
    FOR ALL TO public
    USING (user_id = auth.uid());

CREATE POLICY "Project members can create comments" ON public.comments
    FOR INSERT TO public
    WITH CHECK (EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        JOIN tasks t ON t.project_id = p.id
        WHERE t.id = comments.task_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "Project members can view comments" ON public.comments
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        JOIN tasks t ON t.project_id = p.id
        WHERE t.id = comments.task_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "Default deny policy" ON public.export_jobs
    FOR ALL TO public
    USING (false);

CREATE POLICY "Workspace members can view their export jobs" ON public.export_jobs
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = export_jobs.workspace_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "Project editors can manage tables" ON public.tables
    FOR ALL TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        WHERE p.id = tables.project_id
        AND wm.user_id = auth.uid()
        AND wm.role = ANY (ARRAY['owner', 'admin', 'manager', 'editor'])
    ));

CREATE POLICY "Project members can view tables" ON public.tables
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        WHERE p.id = tables.project_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "Default deny policy" ON public.import_jobs
    FOR ALL TO public
    USING (false);

CREATE POLICY "Workspace members can view their import jobs" ON public.import_jobs
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = import_jobs.workspace_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can mark their notifications as read" ON public.notifications
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Default deny policy" ON public.permission_sets
    FOR ALL TO public
    USING (false);

CREATE POLICY "Workspace members can view permission sets" ON public.permission_sets
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = permission_sets.workspace_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT TO public
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE TO public
    USING (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT TO public
    USING (auth.uid() = id);

CREATE POLICY "Default deny policy" ON public.project_templates
    FOR ALL TO public
    USING (false);

CREATE POLICY "Workspace members can view project templates" ON public.project_templates
    FOR SELECT TO public
    USING (is_public = true OR EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = project_templates.workspace_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "Project editors can manage project views" ON public.project_views
    FOR ALL TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        WHERE p.id = project_views.project_id
        AND wm.user_id = auth.uid()
        AND wm.role = ANY (ARRAY['owner', 'admin', 'manager', 'editor'])
    ));

CREATE POLICY "Project members can view project views" ON public.project_views
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        JOIN projects p ON p.workspace_id = wm.workspace_id
        WHERE p.id = project_views.project_id
        AND wm.user_id = auth.uid()
    ));

CREATE POLICY "Project managers can manage projects" ON public.projects
    FOR ALL TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = projects.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role = ANY (ARRAY['owner', 'admin', 'manager'])
    ));

CREATE POLICY "Workspace members can view projects" ON public.projects
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = projects.workspace_id
        AND workspace_members.user_id = auth.uid()
    ));

CREATE POLICY "Default deny policy" ON public.resource_permissions
    FOR ALL TO public
    USING (false);

CREATE POLICY "Workspace members can view resource permissions" ON public.resource_permissions
    FOR SELECT TO public
    USING (EXISTS (
        SELECT 1 FROM workspace_members wm
        WHERE wm.workspace_id = resource_permissions.workspace_id
        AND wm.user_id = auth.uid()
    ));

-- Drop existing task policies
DROP POLICY IF EXISTS "Project editors can manage tasks" ON public.tasks;
DROP POLICY IF EXISTS "Project members can view tasks" ON public.tasks;

-- Create new task policies
CREATE POLICY "Project editors can manage tasks" ON public.tasks
    FOR ALL
    TO public
    USING (
        EXISTS (
            SELECT 1
            FROM workspace_members wm
            JOIN projects p ON p.workspace_id = wm.workspace_id
            WHERE p.id = tasks.project_id
            AND wm.user_id = auth.uid()
            AND wm.role = ANY (ARRAY['owner', 'admin', 'manager', 'editor'])
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM workspace_members wm
            JOIN projects p ON p.workspace_id = wm.workspace_id
            WHERE p.id = tasks.project_id
            AND wm.user_id = auth.uid()
            AND wm.role = ANY (ARRAY['owner', 'admin', 'manager', 'editor'])
        )
    );

CREATE POLICY "Project members can view tasks" ON public.tasks
    FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1
            FROM workspace_members wm
            JOIN projects p ON p.workspace_id = wm.workspace_id
            WHERE p.id = tasks.project_id
            AND wm.user_id = auth.uid()
        )
    );

-- Refresh the policies
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Add missing foreign key constraints for analytics schema
ALTER TABLE analytics.feature_usage
    ADD CONSTRAINT feature_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    ADD CONSTRAINT feature_usage_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE analytics.page_views
    ADD CONSTRAINT page_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    ADD CONSTRAINT page_views_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

ALTER TABLE analytics.performance_metrics
    ADD CONSTRAINT performance_metrics_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
    ADD CONSTRAINT performance_metrics_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES workspaces(id);

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON analytics.feature_usage(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user ON analytics.feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_workspace ON analytics.feature_usage(workspace_id);

CREATE INDEX IF NOT EXISTS idx_page_views_created ON analytics.page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_user ON analytics.page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_workspace ON analytics.page_views(workspace_id);

CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON public.tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_table ON public.tasks(table_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status_id);
CREATE INDEX IF NOT EXISTS tasks_search_idx ON public.tasks USING gin(search_text);

CREATE INDEX IF NOT EXISTS idx_comments_resolved ON public.comments(is_resolved);
CREATE INDEX IF NOT EXISTS idx_comments_task ON public.comments(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS comments_search_idx ON public.comments USING gin(search_text);

CREATE INDEX IF NOT EXISTS idx_workspace_members_role ON public.workspace_members(role);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);

CREATE INDEX IF NOT EXISTS idx_workspace_invites_email ON public.workspace_invites(email);
CREATE INDEX IF NOT EXISTS idx_workspace_invites_expires ON public.workspace_invites(expires_at);

CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON public.projects(workspace_id);

CREATE INDEX IF NOT EXISTS idx_tables_position ON public.tables("position");
CREATE INDEX IF NOT EXISTS idx_tables_project ON public.tables(project_id);

CREATE INDEX IF NOT EXISTS idx_project_views_project ON public.project_views(project_id);
CREATE INDEX IF NOT EXISTS idx_project_views_type ON public.project_views(type);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read_at) WHERE read_at IS NULL;

-- Add missing value constraints
ALTER TABLE public.project_views
    ADD CONSTRAINT project_views_type_check 
    CHECK (type = ANY (ARRAY['table', 'kanban', 'timeline', 'calendar', 'dashboard']));

-- Enable RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow users to view workspaces they are members of
CREATE POLICY "Users can view workspaces they are members of"
  ON public.workspaces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
    )
  );

-- Allow workspace owners and admins to manage workspace
CREATE POLICY "Workspace owners and admins can manage workspace"
  ON public.workspaces FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- Allow users to view workspace members in their workspaces
CREATE POLICY "Members can view workspace members"
  ON public.workspace_members FOR SELECT
  USING (
    workspace_id IN (
            SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Allow workspace owners and admins to manage workspace members
CREATE POLICY "Admins can manage workspace members"
  ON public.workspace_members FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Allow workspace members to view projects
CREATE POLICY "Workspace members can view projects"
  ON public.projects FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Allow workspace owners, admins, and managers to manage projects
CREATE POLICY "Project managers can manage projects"
  ON public.projects FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'manager')
    )
  );

-- Allow inserting new workspaces
CREATE POLICY "Allow inserting new workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (true);

-- Allow inserting new workspace members
CREATE POLICY "Allow inserting new workspace members"
  ON public.workspace_members FOR INSERT
  WITH CHECK (true);

-- Add RLS policies for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project editors can manage tasks" ON public.tasks
    FOR ALL
    TO public
    USING (
        EXISTS (
            SELECT 1
            FROM workspace_members wm
            JOIN projects p ON p.workspace_id = wm.workspace_id
            WHERE p.id = tasks.project_id
            AND wm.user_id = auth.uid()
            AND wm.role = ANY (ARRAY['owner', 'admin', 'manager', 'editor'])
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM workspace_members wm
            JOIN projects p ON p.workspace_id = wm.workspace_id
            WHERE p.id = tasks.project_id
            AND wm.user_id = auth.uid()
            AND wm.role = ANY (ARRAY['owner', 'admin', 'manager', 'editor'])
        )
    );

CREATE POLICY "Project members can view tasks" ON public.tasks
    FOR SELECT
    TO public
    USING (
        EXISTS (
            SELECT 1
            FROM workspace_members wm
            JOIN projects p ON p.workspace_id = wm.workspace_id
            WHERE p.id = tasks.project_id
            AND wm.user_id = auth.uid()
        )
    );
