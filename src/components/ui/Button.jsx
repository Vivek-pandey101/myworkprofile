import { motion } from 'framer-motion'

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const variants = {
  primary:
    'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover',
  secondary:
    'glass-strong text-text hover:border-border-strong hover:bg-surface',
  ghost: 'text-muted hover:text-text',
}

/**
 * Polished button/link with hover + tap micro-interactions.
 */
export default function Button({
  as = 'a',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const Comp = motion[as] || motion.a
  return (
    <Comp
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {variant === 'primary' && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <span className="absolute -inset-x-4 -top-1 h-full -translate-x-full skew-x-12 bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-[220%]" />
        </span>
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </Comp>
  )
}
