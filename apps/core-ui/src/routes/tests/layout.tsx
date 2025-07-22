/**
 * Layout component for the Tests section
 */

import { Outlet } from '@modern-js/runtime/router';

export default function TestsLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
