import { createFileRoute } from '@tanstack/react-router';
import { beforeLoad } from '../utils/beforeLoad';

export const Route = createFileRoute('/about')({
  component: About,
  beforeLoad,
});

function About() {
  return <div className="p-2">Hello from About!</div>;
}
