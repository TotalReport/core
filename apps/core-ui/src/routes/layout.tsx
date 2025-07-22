import { Outlet } from '@modern-js/runtime/router';
import '../styles/globals.css';
import { Layout as AppLayout } from '../containers/layout.js';

export default function Layout() {
  return (
    <div className="h-screen w-full">
      <AppLayout>
        <Outlet />
      </AppLayout>
    </div>
  );
}
