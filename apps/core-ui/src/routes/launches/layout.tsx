import { Outlet } from '@modern-js/runtime/router';

export default function LaunchesLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
