import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth, User } from '../auth';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../main';
import { beforeLoad } from '../utils/beforeLoad';

export const Route = createFileRoute('/manage')({
  component: ManageComponent,
  beforeLoad,
});

export async function putPermission(formData: Partial<User>) {
  return fetch(
    `https://65d68e9df6967ba8e3be3ab7.mockapi.io/api/v1/manatePermission/1`,
    {
      body: JSON.stringify(formData),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then((r) => r.json() as Promise<User>);
}

export const useUpdatePermissionMutation = (navigate) => {
  return useMutation({
    mutationKey: ['permission'],
    mutationFn: putPermission,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      navigate({ to: Route.to });
    },
    gcTime: 20,
  });
};

function ManageComponent() {
  const auth = useAuth();

  const navigate = useNavigate({ from: Route.to });
  const manageTaskCreate = auth.user?.permissions.manageTaskCreate;
  const manageTaskEdit = auth.user?.permissions.manageTaskEdit;
  const manageTaskRemove = auth.user?.permissions.manageTaskRemove;
  const updatePermissionMutation = useUpdatePermissionMutation(navigate);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        updatePermissionMutation.mutate({
          manageTaskCreate: !!formData.get('manageTaskCreate') as boolean,
          manageTaskEdit: !!formData.get('manageTaskEdit') as boolan,
          manageTaskRemove: !!formData.get('manageTaskRemove') as boolan,
        });
      }}
    >
      <label htmlFor="manageTaskCreate">manageTaskCreate</label>
      <input
        id="manageTaskCreate"
        name="manageTaskCreate"
        type="checkbox"
        defaultChecked={manageTaskCreate || false}
      />

      <br />
      <label htmlFor="manageTaskEdit">manageTaskEdit</label>
      <input
        id="manageTaskEdit"
        name="manageTaskEdit"
        type="checkbox"
        defaultChecked={manageTaskEdit || false}
      />
      <br />
      <label htmlFor="manageTaskRemove">manageTaskRemove</label>
      <input
        id="manageTaskRemove"
        name="manageTaskRemove"
        type="checkbox"
        defaultChecked={manageTaskRemove || false}
      />
      <div>
        <button type="submit">更新</button>
      </div>
    </form>
  );
}
