import { redirect } from '@tanstack/react-router';
import { RouterContext } from '../types';
import { permissionsQueryOptions } from '../auth';

export async function beforeLoad({
  context,
  location,
}: {
  context: RouterContext;
  location: any;
}) {
  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    });
  }
  const data = await context.queryClient.ensureQueryData(
    permissionsQueryOptions
  );
  context.auth.setUser({
    name: context.auth.user?.name || '',
    permissions: data[0],
  });
}
