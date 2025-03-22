import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
          {
            'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl': variant === 'primary',
            'bg-white text-gray-900 hover:bg-gray-50 shadow-md hover:shadow-lg': variant === 'secondary',
            'border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-900 hover:text-blue-600 hover:border-blue-600 shadow-sm hover:shadow-md': variant === 'outline',
            'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900': variant === 'ghost',
            'text-sm px-4 py-2': size === 'sm',
            'text-base px-6 py-2.5': size === 'md',
            'text-base px-8 py-3': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };