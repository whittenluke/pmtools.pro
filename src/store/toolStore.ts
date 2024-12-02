import { create } from 'zustand';
import type { Tool, ToolUsage } from '../types/tool';

interface ToolState {
  tools: Tool[];
  usage: ToolUsage[];
  addUsage: (toolId: string) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  tools: [],
  usage: [],
  addUsage: (toolId: string) =>
    set((state) => {
      const now = new Date();
      const existingUsage = state.usage.find((u) => u.toolId === toolId);

      if (existingUsage) {
        return {
          usage: state.usage.map((u) =>
            u.toolId === toolId
              ? { ...u, usageCount: u.usageCount + 1, lastUsed: now }
              : u
          ),
        };
      }

      return {
        usage: [...state.usage, { toolId, usageCount: 1, lastUsed: now }],
      };
    }),
}));