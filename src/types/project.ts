export interface Project {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
}

export interface ProjectData {
  columns: Column[];
  tasks: Task[];
}

export interface Column {
  id: string;
  title: string;
  position: number;
  project_id: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  column_id: string;
  project_id: string;
  position: number;
  tags: string[];
  created_at: Date;
  updated_at: Date;
} 