import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="text-center mb-8">
      <h1 className="section-title">{title}</h1>
      {description && (
        <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
      )}
    </header>
  );
}
