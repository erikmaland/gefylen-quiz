'use client';

import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Add padding to top on mobile to account for menu button */}
          <div className="pt-14 lg:pt-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
} 