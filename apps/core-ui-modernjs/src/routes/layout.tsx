import { Outlet } from '@modern-js/runtime/router';
import '../styles/globals.css';

export default function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
