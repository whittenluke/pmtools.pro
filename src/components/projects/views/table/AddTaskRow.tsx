import { ViewColumn } from "@/types";
import { useProjectStore } from "@/stores/project";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddTaskRowProps {
  columns: ViewColumn[];
}

export function AddTaskRow({ columns }: AddTaskRowProps) {
  const { createTask, currentProject, currentView, tasks } = useProjectStore();

  const handleAddTask = async () => {
    if (!currentProject || !currentView) return;

    try {
      // Calculate the new position - place at the end
      const maxPosition = tasks.length > 0 
        ? Math.max(...tasks.map(t => t.position))
        : -1;
      
      await createTask({
        project_id: currentProject.id,
        title: "",
        status_id: currentView.config?.status_config?.defaultStatusId || "not_started",
        column_values: {},
        position: maxPosition + 1,
      });
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <div className="relative group hover:bg-muted/50">
      <Button
        variant="ghost"
        className="h-8 px-2"
        onClick={handleAddTask}
      >
        <Plus className="h-4 w-4 mr-1" />
        <span className="text-sm font-medium">Add task</span>
      </Button>
    </div>
  );
} 