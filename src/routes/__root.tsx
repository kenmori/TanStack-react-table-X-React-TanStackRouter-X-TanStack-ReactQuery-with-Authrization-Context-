import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { QueryClient } from '@tanstack/react-query';
import { useAuth, AuthContextType } from '/src/auth';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export interface RouterContext {
  queryClient: QueryClient;
  auth: AuthContextType;
  permissions: {
    manageTaskCreate: boolean;
    manageTaskEdit: boolean;
    manageTaskRemove: boolean;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

// permissions:
function RootComponent() {
  const auth = useAuth();
  // const cache = queryClient.getQueryData(['permissions']);
  return (
    <>
      <div style={{ border: '1px solid red' }}>
        <div style={{ color: 'red' }}>root layout</div>
        <div>
          {auth.isAuthenticated ? (
            <div>
              <Link
                to={'/tasks'}
                activeProps={{
                  className: 'font-bold',
                }}
              >
                Dashboard
              </Link>
              <div className="p-2 flex gap-2">
                <Link to="/" className="[&.active]:font-bold">
                  Home
                </Link>{' '}
                {/* {cache[0].manageTaskCreate ? (
                  <Link to="/about" className="[&.active]:font-bold">
                    About
                  </Link>
                ) : null}{' '} */}
                {auth.user?.permissions.manageTaskCreate ? (
                  <Link to="/about" className="[&.active]:font-bold">
                    About
                  </Link>
                ) : null}{' '}
                <Link to="/tasks" className="[&.active]:font-bold">
                  Tasks
                </Link>{' '}
                <Link to="/manage" className="[&.active]:font-bold">
                  Authority management
                </Link>{' '}
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                activeProps={{
                  className: 'font-bold',
                }}
                search={{ redirect: '/' }}
              >
                Login
              </Link>
              {'  '}
              <Link to="/table">table</Link>
            </>
          )}
        </div>
        <hr />
        <Outlet />
        <ReactQueryDevtools buttonPosition="bottom-right" />
        <TanStackRouterDevtools />
      </div>
    </>
  );
}
