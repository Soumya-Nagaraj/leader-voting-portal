import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  as?: typeof Link;
  to?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', as: Component = 'button', to, ...props }, ref) => {
    const buttonClasses = cn(
      'btn',
      {
        'btn-primary': variant === 'primary',
        'btn-secondary': variant === 'secondary',
        'btn-accent': variant === 'accent',
        'btn-danger': variant === 'danger',
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
      },
      className
    );

    if (Component === Link && to) {
      return <Component to={to} className={buttonClasses} {...props} />;
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;