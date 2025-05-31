/**
 * Layout component for the Settings section
 */

import { Outlet } from '@modern-js/runtime/router';

export default function SettingsLayout() {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
