import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../auth';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const auth = useAuth();
  const navigate = useNavigate({ from: '/index' });
  const handleLogout = () => {
    auth.setUser(null);
    navigate({ to: '/' });
  };
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <p>
        <Link to="/tasks" className="font-semibold">
          {auth.isAuthenticated ? 'Go' : 'Try going'} to the tasks page
        </Link>
      </p>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
}
