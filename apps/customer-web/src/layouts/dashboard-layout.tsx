import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from '@/components/navigation/dashboard-sidebar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar — hidden on mobile, visible from md up */}
      <aside className="hidden border-r bg-card md:flex md:w-64 lg:w-72">
        <DashboardSidebar />
      </aside>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
