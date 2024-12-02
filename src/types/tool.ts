export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  category: ToolCategory;
}

export interface ToolUsage {
  toolId: string;
  usageCount: number;
  lastUsed: Date;
}

export type ToolCategory = 
  | 'Calculation'
  | 'Time Management'
  | 'Project Planning'
  | 'Documentation'
  | 'Productivity'
  | 'Automation';

export interface CategoryInfo {
  name: ToolCategory;
  description: string;
  color: string;
}