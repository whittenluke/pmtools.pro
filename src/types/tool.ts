import type { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  category: ToolCategory;
}

export interface ToolUsage {
  toolId: string;
  usageCount: number;
  lastUsed: Date;
}

export type ToolCategory = 
  | 'Project Planning'
  | 'Time Management'
  | 'Analysis'
  | 'Calculation'
  | 'Documentation'
  | 'Productivity'
  | 'Automation';

export interface CategoryInfo {
  name: ToolCategory;
  description: string;
  color: string;
}