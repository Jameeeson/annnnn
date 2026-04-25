import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'default' | 'outline' | 'ghost' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ring-offset-background',
          {
            'bg-zinc-800 text-white hover:bg-zinc-700 shadow-md shadow-black/20': variant === 'default',
            'border-2 border-zinc-700 text-zinc-300 hover:bg-zinc-900': variant === 'outline',
            'text-zinc-400 hover:bg-zinc-900': variant === 'ghost',
            'bg-zinc-900/50 backdrop-blur-md border border-zinc-800 text-zinc-200 shadow-lg hover:bg-zinc-800/80': variant === 'glass',
            'h-10 px-6 py-2': size === 'default',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-12 px-8 py-3 text-lg': size === 'lg',
            'h-12 w-12 rounded-full p-0': size === 'icon',
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
