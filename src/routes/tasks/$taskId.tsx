import { useMutation } from '@tanstack/react-query';
import { TaskFields } from '../../components/TaskFields';
import { beforeLoad } from '../../utils/beforeLoad';
import { createFileRoute } from '@tanstack/react-router';
import { PickAsRequired } from '@tanstack/react-router';
import { queryClient } from '../../main';

export function Task() {
  return <div>Hello /tasks/$taskId!</div>;
}

type Task = { title: string; body: string; id: string };

export const Route = createFileRoute('/tasks/$taskId')({
  beforeLoad,
  loader: async ({ params }) => {
    console.log(`Fetching post with id ${params.taskId}...`);

    await new Promise((r) => setTimeout(r, Math.round(Math.random() * 300)));

    return fetch(
      `https://65cd3e7edd519126b8404907.mockapi.io/api/v1/todos/${params.taskId}`
    ).then((r) => r.json() as Promise<Task>);
  },
  component: TaskComponent,
});

export async function putTask(formData: PickAsRequired<Partial<Task>, 'id'>) {
  return fetch(
    `https://65cd3e7edd519126b8404907.mockapi.io/api/v1/todos/${formData.id}`,
    {
      body: JSON.stringify(formData),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((r) => r.json() as Promise<Task>);
}

export const useUpdateTaskMutation = (taskId: string) => {
  return useMutation({
    mutationKey: ['tasks', 'update', taskId],
    mutationFn: putTask,
    onSuccess: () => queryClient.invalidateQueries(),
    gcTime: 1000 * 10,
  });
};

function TaskComponent() {
  const task = Route.useLoaderData();
  // const navigate = useNavigate();
  const params = Route.useParams();
  const updateTaskMutation = useUpdateTaskMutation(params.taskId);

  return (
    <div className="space-y-2">
      <form
        key={task.id}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          console.log('event.target', event.target);
          const formData = new FormData(event.target as HTMLFormElement);
          updateTaskMutation.mutate({
            id: task.id,
            title: formData.get('title') as string,
            body: formData.get('body') as string,
          });
        }}
        className="p-2 space-y-2"
      >
        <TaskFields task={task} />

        <button
          type="submit"
          disabled={updateTaskMutation?.status === 'pending'}
          style={{ marginLeft: 100 }}
        >
          更新
        </button>
      </form>
      {updateTaskMutation?.variables?.id === task.id ? (
        <div key={updateTaskMutation?.submittedAt}>
          {updateTaskMutation?.status === 'success' ? (
            <div className="inline-block px-2 py-1 rounded bg-green-500 text-white animate-bounce [animation-iteration-count:2.5] [animation-duration:.3s]">
              Saved!
            </div>
          ) : updateTaskMutation?.status === 'error' ? (
            <div className="inline-block px-2 py-1 rounded bg-red-500 text-white animate-bounce [animation-iteration-count:2.5] [animation-duration:.3s]">
              Failed to save.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
