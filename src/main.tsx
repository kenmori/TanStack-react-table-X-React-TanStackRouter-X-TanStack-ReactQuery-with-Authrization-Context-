import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import { Route } from './routes/__root';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './auth';

export const queryClient = new QueryClient();

// Create a new router instance
const router = createRouter<typeof routeTree>({
  routeTree: routeTree.addChildren(Route.children),
  context: {
    queryClient,
    permissions: {
      manageTaskCreate: false,
      manageTaskEdit: false,
      manageTaskRemove: false,
    },
    auth: {
      setUser: useAuth,
      user: null,
      isAuthenticated: false,
    },
  },
});

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
