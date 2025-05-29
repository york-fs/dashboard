'use client';

import Layout from '../../components/Layout';
import InverterComponent from '../../features/telemetry/InverterComponent';
import Link from 'next/link';

export default function InverterFocusPage() {
  return (
    <Layout title="Inverter Focus View">
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>
            Dashboard
          </Link>
          <span style={{ color: 'var(--foreground)' }}>›</span>
          <span style={{ color: 'var(--foreground)' }}>Inverter Focus View</span>
        </div>

        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border transition-colors"
            style={{ 
              backgroundColor: 'var(--background-secondary)', 
              borderColor: 'var(--border)', 
              color: 'var(--foreground)' 
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Focused Inverter Component */}
        <div className="max-w-4xl">
          <InverterComponent />
        </div>
      </div>
    </Layout>
  );
} 