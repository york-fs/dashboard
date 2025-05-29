import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { ATCommandConsole } from './ATCommandConsole';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Electric Vehicle Dashboard' }) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <header className="shadow-sm border-b" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity" style={{ color: 'var(--foreground)' }}>
                EV Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{title}</h1>
        </div>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm" style={{ color: 'var(--foreground)' }}>
            © 2024 Electric Vehicle Dashboard. Built with Next.js and TypeScript.
          </div>
        </div>
      </footer>

      {/* AT Command Console - Floating */}
      <ATCommandConsole />
    </div>
  );
};

export default Layout; 