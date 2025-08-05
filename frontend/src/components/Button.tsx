import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '',
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props 
  }, ref) => {
    const Comp = asChild ? 'button' : 'button';
    
    // Base classes
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors';
    const focusClasses = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500';
    const disabledClasses = 'disabled:opacity-50 disabled:pointer-events-none';
    
    // Variant classes
    const variants = {
      default: 'bg-green-600 text-white hover:bg-green-700',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      ghost: 'hover:bg-gray-100',
      link: 'text- green-600 hover:underline',
    };
    
    // Size classes
    const sizes = {
      default: 'h-10 py-2 px-4',
      sm: 'h-9 px-3 rounded-md',
      lg: 'h-11 px-8 rounded-md',
      icon: 'h-10 w-10',
    };
    
    const buttonClasses = [
      baseClasses,
      focusClasses,
      disabledClasses,
      variants[variant as keyof typeof variants] || variants.default,
      sizes[size as keyof typeof sizes] || sizes.default,
      className
    ].filter(Boolean).join(' ');
    
    return (
      <Comp
        className={buttonClasses}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
