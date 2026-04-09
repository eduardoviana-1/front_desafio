import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="px-12 py-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h2>
          <p className="text-sm font-medium text-zinc-500 mt-1">{description}</p>
        </div>
        {action && (
          <div className="flex items-center gap-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
