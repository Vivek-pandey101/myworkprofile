import { motion } from 'framer-motion'
import Section, { SectionHeading } from './ui/Section'
import { aboutCards, aboutIntro } from '../data/content'
import { fadeUp, stagger, scaleIn, viewportOnce } from './ui/motion'

export default function About() {
  return (
    <Section id="about">
      <div className="flex flex-col items-center">
        <SectionHeading
          eyebrow="About Me"
          title="Turning business challenges into reliable software"
          description={aboutIntro}
        />
      </div>

      <motion.div
        variants={stagger(0.1, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {aboutCards.map(({ icon: Icon, title, body }) => (
          <motion.div
            key={title}
            variants={scaleIn}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 transition-colors hover:border-border-strong"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl text-secondary ring-1 ring-inset ring-white/5">
              <Icon />
            </div>
            <h3 className="mb-2 font-display text-base font-semibold text-text">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{body}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Highlight strip */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3"
      >
        {[
          { k: '1.5+ yrs', v: 'Full Stack Development' },
          { k: 'CRM · SaaS', v: 'Business Applications' },
          { k: 'Cloud-native', v: 'Deployment & Scaling' },
        ].map((item) => (
          <div key={item.v} className="bg-surface/80 px-6 py-6 text-center">
            <p className="font-display text-xl font-bold text-gradient-brand">
              {item.k}
            </p>
            <p className="mt-1 text-sm text-muted">{item.v}</p>
          </div>
        ))}
      </motion.div>
    </Section>
  )
}
