'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link href={item.href} className="hover:underline transition-colors" style={{ color: 'var(--accent)' }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--foreground)' }}>{item.label}</span>
          )}
          
          {index < items.length - 1 && (
            <span style={{ color: 'var(--foreground)' }}>›</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}; 