import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Electric Car Dashboard' }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }} className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-sm" style={{ color: 'var(--foreground)' }}>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--background)', borderTop: '1px solid var(--border)' }} className="mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm" style={{ color: 'var(--foreground)' }}>
            Electric Car Dashboard - Real-time Telemetry System
          </div>
        </div>
      </footer>
    </div>
  );
} 