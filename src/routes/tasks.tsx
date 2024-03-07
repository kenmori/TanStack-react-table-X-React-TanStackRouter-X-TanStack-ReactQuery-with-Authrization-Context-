import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import {
  Link,
  Outlet,
  createFileRoute,
  MatchRoute,
} from '@tanstack/react-router';
import { beforeLoad } from '../utils/beforeLoad';

async function fetchTasks() {
  const data = await fetch(
    'https://65cd3e7edd519126b8404907.mockapi.io/api/v1/todos'
  );
  const json = await data.json();
  return json;
}

const tasksQueryOptions = queryOptions({
  queryKey: ['tasks'],
  queryFn: () => fetchTasks(),
});

export const Route = createFileRoute('/tasks')({
  beforeLoad,
  loader: ({ context: { queryClient, auth } }) => {
    return queryClient.ensureQueryData(tasksQueryOptions);
  },
  component: TasksComponent,
});

function TasksComponent() {
  const tasksQuery = useSuspenseQuery(tasksQueryOptions);
  const tasks = tasksQuery.data;
  return (
    <div className="flex-1 flex">
      <ul>
        {tasks.map((e: any) => {
          return (
            <li key={e.id} className="whitespace-nowrap">
              <Link
                to="/tasks/$taskId"
                params={{
                  taskId: e.id,
                }}
                preload="intent"
                className="block py-2 px-3 text-blue-700"
                activeProps={{ className: `font-bold` }}
              >
                <pre className="text-sm">
                  #{e.id} - {e.title}{' '}
                  <MatchRoute
                    to="/tasks/$taskId"
                    params={{
                      taskId: e.id,
                    }}
                    pending
                  ></MatchRoute>
                </pre>
              </Link>
            </li>
          );
        })}
      </ul>
      <hr />
      <div className="flex-1 border-l border-gray-200">
        <Outlet />
      </div>
    </div>
  );
}
