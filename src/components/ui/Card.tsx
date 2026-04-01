import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
  className?: string;
  headerAction?: ReactNode;
  variant?: 'default' | 'overlap';
}

export function Card({ 
  children, 
  title, 
  icon, 
  className = '', 
  headerAction,
  variant = 'default' 
}: CardProps) {
  const overlapClasses = variant === 'overlap' ? '-mt-8 shadow-xl' : 'shadow-sm';

  return (
    <div className={`bg-white rounded-xl border border-zinc-200 overflow-hidden ${overlapClasses} ${className}`}>
      {(title || icon) && (
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            {icon}
            {title}
          </h3>
          {headerAction}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
