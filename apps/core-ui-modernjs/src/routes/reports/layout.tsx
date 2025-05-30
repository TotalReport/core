/**
 * Layout component for the Reports section
 */

import { Outlet } from '@modern-js/runtime/router';

export default function ReportsLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
