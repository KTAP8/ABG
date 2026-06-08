import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'disabled'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', ...props }, ref) => {
    const baseClasses = 'px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-all cursor-pointer'
    const variants = {
      primary: 'bg-charcoal border border-charcoal text-cream hover:bg-black hover:border-black active:bg-charcoal',
      ghost: 'border border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-cream active:bg-transparent active:text-charcoal',
      disabled: 'border border-charcoal/30 bg-charcoal/5 text-charcoal/40 cursor-not-allowed',
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
