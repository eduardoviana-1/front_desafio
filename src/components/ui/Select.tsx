import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: ReactNode;
}

export function Select({ label, icon, children, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-sm font-bold text-zinc-700">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            {icon}
          </div>
        )}
        <select
          className={`
            w-full py-2.5 border border-zinc-200 rounded-lg 
            focus:ring-2 focus:ring-emerald-800 focus:border-transparent 
            outline-none appearance-none bg-white text-zinc-900
            ${icon ? 'pl-10' : 'px-4'}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
