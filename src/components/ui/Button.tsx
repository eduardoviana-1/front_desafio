import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'white';
  icon?: ReactNode;
  isLoading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  icon, 
  isLoading, 
  className = '', 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm shadow-emerald-900/10',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-900',
    danger: 'text-zinc-400 hover:text-red-600 hover:bg-red-50',
    ghost: 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900',
    white: 'bg-white text-zinc-900 hover:bg-zinc-100 border border-zinc-200'
  };

  return (
    <button
      className={`
        flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg 
        font-bold transition-all active:scale-[0.98] disabled:opacity-50 
        disabled:pointer-events-none text-sm
        ${variants[variant]}
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
