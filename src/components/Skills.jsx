import { motion } from 'framer-motion'
import { HiOutlineArrowRight } from 'react-icons/hi2'
import Section, { SectionHeading } from './ui/Section'
import { skillCategories } from '../data/content'
import { hasGuide, slugify } from '../data/skillGuideMeta'
import { fadeUp, stagger, viewportOnce } from './ui/motion'

const referenceBase = `${import.meta.env.BASE_URL}reference.html`

export default function Skills() {
  return (
    <Section id="skills">
      <div className="flex flex-col items-center">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Tools I use to build & ship"
          description="A modern full stack toolkit spanning frontend, backend, databases, and cloud infrastructure. Tap a badge with an arrow to open its command reference."
        />
      </div>

      <motion.div
        variants={stagger(0.12, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-16 grid gap-6 md:grid-cols-2"
      >
        {skillCategories.map((category) => (
          <motion.div
            key={category.title}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-border-strong sm:p-7"
          >
            {/* accent glow */}
            <div
              className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
              style={{ background: category.accent }}
            />

            <div className="mb-6 flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: category.accent }}
              />
              <h3 className="font-display text-lg font-semibold text-text">
                {category.title}
              </h3>
              <span className="ml-auto text-xs font-medium text-muted">
                {category.skills.length} skills
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {category.skills.map(({ name, icon: Icon }) => {
                const commonClasses =
                  'inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3.5 py-2 text-sm font-medium text-text/90 transition-colors hover:border-border-strong hover:text-text'

                // Skills with a reference guide are same-tab links to its page.
                if (hasGuide(name)) {
                  return (
                    <motion.a
                      key={name}
                      href={`${referenceBase}?skill=${slugify(name)}`}
                      whileHover={{ y: -3, scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      aria-label={`Open ${name} command reference`}
                      className={`${commonClasses} group/badge cursor-pointer hover:border-primary/50`}
                    >
                      <Icon
                        className="text-base"
                        style={{ color: category.accent }}
                      />
                      {name}
                      <HiOutlineArrowRight className="text-sm text-muted transition-transform group-hover/badge:translate-x-0.5" />
                    </motion.a>
                  )
                }

                return (
                  <motion.span
                    key={name}
                    whileHover={{ y: -3, scale: 1.04 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className={`${commonClasses} cursor-default`}
                  >
                    <Icon
                      className="text-base"
                      style={{ color: category.accent }}
                    />
                    {name}
                  </motion.span>
                )
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
