import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  animate,
} from 'framer-motion'
import { HiCheckBadge } from 'react-icons/hi2'
import Section, { SectionHeading } from './ui/Section'
import { stats, achievements } from '../data/content'
import { fadeUp, stagger, viewportOnce } from './ui/motion'

function CountUp({ value, suffix = '', raw = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const motionVal = useMotionValue(0)
  const [display, setDisplay] = useState(raw ? String(value) : '0')
  const isFloat = !Number.isInteger(value)

  useEffect(() => {
    // Year-like values are shown verbatim (no count-up from zero).
    if (raw || !inView) return
    const controls = animate(motionVal, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(isFloat ? v.toFixed(1) : Math.round(v).toString()),
    })
    return controls.stop
  }, [inView, value, motionVal, isFloat, raw])

  return (
    <span ref={ref}>
      {raw ? value : display}
      {suffix}
    </span>
  )
}

export default function Achievements() {
  return (
    <Section id="achievements">
      <div className="flex flex-col items-center">
        <SectionHeading
          eyebrow="Achievements"
          title="Results that speak for themselves"
          description="A track record of shipping production software that businesses rely on every day."
        />
      </div>

      {/* Stat cards */}
      <motion.div
        variants={stagger(0.1, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 text-center backdrop-blur"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
            <p className="font-display text-4xl font-extrabold text-gradient-brand sm:text-5xl">
              <CountUp value={stat.value} suffix={stat.suffix} raw={stat.raw} />
            </p>
            <p className="mt-2 text-sm font-medium text-muted">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Achievement list */}
      <motion.div
        variants={stagger(0.08, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {achievements.map((item) => (
          <motion.div
            key={item}
            variants={fadeUp}
            className="group flex items-start gap-3 rounded-2xl border border-border bg-surface/40 p-5 backdrop-blur transition-colors hover:border-border-strong"
          >
            <span className="mt-0.5 text-xl text-secondary transition-transform group-hover:scale-110">
              <HiCheckBadge />
            </span>
            <p className="text-sm font-medium leading-relaxed text-text/90">
              {item}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
