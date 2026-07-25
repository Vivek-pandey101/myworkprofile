import { motion } from 'framer-motion'
import { fadeUp, stagger, viewportOnce } from './motion'

/**
 * Consistent section shell: id anchor, vertical rhythm, centered container.
 */
export default function Section({ id, className = '', children }) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-32 ${className}`}
    >
      {children}
    </section>
  )
}

/**
 * Eyebrow + heading + optional description, animated on scroll into view.
 */
export function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const alignment =
    align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto'

  return (
    <motion.div
      variants={stagger(0.12)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`flex max-w-2xl flex-col gap-4 ${alignment}`}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className="text-3xl font-bold text-gradient sm:text-4xl md:text-[2.75rem] md:leading-[1.1]"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className="text-base leading-relaxed text-muted sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
