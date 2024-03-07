import { createFileRoute } from '@tanstack/react-router';
import { TaskFields } from '../../components/TaskFields';
import { Spinner } from '../../components/Spinner';

import { queryClient } from '../../main';
import { useMutation } from '@tanstack/react-query';
export const Route = createFileRoute('/tasks/')({
  component: TaskIndexComponent,
});

type Task = { title: string; body: string; id: string };

export async function postTask(formData: Pick<Task, 'title' | 'body'>) {
  return fetch(`https://65cd3e7edd519126b8404907.mockapi.io/api/v1/todos/`, {
    body: JSON.stringify(formData),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((r) => r.json() as Promise<Task>);
}

export const useCreateTaskMutation = () => {
  return useMutation({
    // mutationKey: ['invoices', 'create'],
    mutationFn: postTask,
    onSuccess: () => queryClient.invalidateQueries(),
  });
};

function TaskIndexComponent() {
  const createTaskMutation = useCreateTaskMutation();
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const formData = new FormData(event.target as HTMLFormElement);
          createTaskMutation.mutate({
            title: formData.get('title') as string,
            body: formData.get('body') as string,
          });
        }}
        className="space-y-2"
      >
        <div>Create a new Task:</div>
        <TaskFields task={{} as Task} />
        <div>
          <button
            className="bg-blue-500 rounded p-2 uppercase text-white font-black disabled:opacity-50"
            disabled={createTaskMutation?.status === 'pending'}
          >
            {createTaskMutation?.status === 'pending' ? (
              <>
                Creating <Spinner />
              </>
            ) : (
              'Create'
            )}
          </button>
        </div>
        {createTaskMutation?.status === 'success' ? (
          <div className="inline-block px-2 py-1 rounded bg-green-500 text-white animate-bounce [animation-iteration-count:2.5] [animation-duration:.3s]">
            Created!
          </div>
        ) : createTaskMutation?.status === 'error' ? (
          <div className="inline-block px-2 py-1 rounded bg-red-500 text-white animate-bounce [animation-iteration-count:2.5] [animation-duration:.3s]">
            Failed to create.
          </div>
        ) : null}
      </form>
    </div>
  );
}
