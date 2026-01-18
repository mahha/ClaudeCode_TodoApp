import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";

interface TodoItemProps {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

export function TodoItem({ id, title, description, completed }: TodoItemProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const response = await fetch(`/api/todos/${id}/toggle`, {
        method: "PATCH",
      });

      if (response.ok) {
        // Reload the current page to refresh the todo list
        const tab = searchParams.get("tab") || "incomplete";
        navigate(`/?tab=${tab}`, { replace: true });
      }
    } catch (error) {
      console.error("Failed to toggle todo:", error);
      setIsToggling(false);
    }
  };

  // Show optimistic UI while toggling
  const displayCompleted = isToggling ? !completed : completed;

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={displayCompleted}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 rounded border-2 border-black cursor-pointer"
          aria-label={`Mark "${title}" as ${completed ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-1">
          <h3 className="text-sm font-normal text-black">{title}</h3>
          {description && (
            <p className="text-sm text-[#676767] mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
