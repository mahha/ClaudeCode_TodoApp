interface TodoItemProps {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

export function TodoItem({ title, description, completed }: TodoItemProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={completed}
          readOnly
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
