import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'disabled'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', ...props }, ref) => {
    const baseClasses = 'px-4 py-2 font-body text-sm uppercase tracking-wide transition-all'
    const variants = {
      primary: 'bg-black text-cream hover:bg-charcoal',
      ghost: 'border border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-cream',
      disabled: 'bg-charcoal text-cream opacity-50 cursor-not-allowed',
    }

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variants[variant]} ${className}`}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
