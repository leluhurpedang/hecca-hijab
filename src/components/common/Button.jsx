import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-mocha-500 hover:bg-mocha-600 text-white shadow-sm hover:shadow focus:ring-mocha-400 rounded-full',
    dark: 'bg-espresso-900 hover:bg-espresso-950 text-white shadow-sm hover:shadow focus:ring-espresso-800 rounded-full',
    secondary: 'bg-sand-100 hover:bg-sand-200 text-espresso-900 focus:ring-sand-300 rounded-full',
    outline: 'border border-sand-300 text-espresso-900 hover:border-mocha-500 hover:text-mocha-600 hover:bg-cream-50 focus:ring-mocha-300 rounded-full',
    ghost: 'text-espresso-800 hover:bg-sand-100 hover:text-espresso-950 rounded-full',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400 rounded-full',
    whatsapp: 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm hover:shadow-md focus:ring-[#25D366] rounded-full'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
    xl: 'text-lg px-8 py-4 gap-3',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
