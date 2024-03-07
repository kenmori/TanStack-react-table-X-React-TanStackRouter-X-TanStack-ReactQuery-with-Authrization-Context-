export function TaskFields({
  task,
  disabled,
}: {
  task: { title: string; body: string; id: string };
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <h2 className="font-bold text-lg">
        <input
          name="title"
          defaultValue={task?.title}
          placeholder="Task Title"
          className="border border-opacity-50 rounded p-2 w-full"
          disabled={disabled}
        />
      </h2>
      <div>
        <textarea
          name="body"
          defaultValue={task?.body}
          rows={6}
          placeholder="Task Body..."
          className="border border-opacity-50 p-2 rounded w-full"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
