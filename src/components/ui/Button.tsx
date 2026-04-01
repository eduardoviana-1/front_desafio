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
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100',
    secondary: 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-100',
    danger: 'text-zinc-400 hover:text-red-600 hover:bg-red-50',
    ghost: 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
    white: 'bg-white text-zinc-900 hover:bg-zinc-200'
  };

  return (
    <button
      className={`
        flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg 
        font-bold transition-all active:scale-95 disabled:opacity-50 
        disabled:pointer-events-none shadow-lg
        ${variants[variant]}
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="h-5 w-5 border-2 border-current border-t-transparent animate-spin rounded-full" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
