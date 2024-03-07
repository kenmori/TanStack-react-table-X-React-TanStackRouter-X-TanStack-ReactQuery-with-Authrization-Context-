import React from 'react';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

// https://tanstack.com/router/v1/docs/framework/react/examples/authenticated-routes-context

export type AuthContextType = {
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  user: User;
};

export type User = {
  name: string;
  permissions: {
    manageTaskCreate: boolean;
    manageTaskEdit: boolean;
    manageTaskRemove: boolean;
  };
} | null;

const AuthContext = React.createContext<AuthContextType | null>(null);

async function fetchPermissions() {
  const data = await fetch(
    'https://65d68e9df6967ba8e3be3ab7.mockapi.io/api/v1/manatePermission'
  );
  const json = await data.json();
  return json;
}

export const permissionsQueryOptions = queryOptions({
  queryKey: ['permissions'],
  queryFn: () => fetchPermissions(),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const permissionsQuery = useSuspenseQuery(permissionsQueryOptions);

  const [user, setUser] = React.useState<User>({
    name: '',
    permissions: permissionsQuery.data[0],
  });
  const isAuthenticated = !!user?.name;
  console.log('permissionsQuery.data[0]', permissionsQuery.data[0], user);
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser }}>
      <div>{children}</div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
