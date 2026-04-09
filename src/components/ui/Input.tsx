import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
}

export function Input({ label, icon, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-sm font-bold text-zinc-700">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full py-2.5 border border-zinc-200 rounded-lg 
            focus:ring-2 focus:ring-emerald-800 focus:border-transparent 
            outline-none transition-all text-zinc-900 placeholder:text-zinc-500
            ${icon ? 'pl-10' : 'px-4'}
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
}
