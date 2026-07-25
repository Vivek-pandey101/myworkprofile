import { motion } from 'framer-motion'
import { HiOutlineBriefcase, HiCheckCircle } from 'react-icons/hi2'
import Section, { SectionHeading } from './ui/Section'
import { experience } from '../data/content'
import { fadeUp, stagger, viewportOnce } from './ui/motion'

export default function Experience() {
  return (
    <Section id="experience">
      <div className="flex flex-col items-center">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've made an impact"
          description="Ownership across the full lifecycle — from architecture and APIs to deployment and reliability."
        />
      </div>

      <div className="relative mt-16">
        {/* Timeline rail */}
        <div className="absolute left-4 top-2 h-full w-px bg-gradient-to-b from-primary via-secondary/50 to-transparent md:left-1/2 md:-translate-x-1/2" />

        {experience.map((job, i) => (
          <motion.div
            key={job.role + i}
            variants={stagger(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative pl-12 md:pl-0 [&:not(:last-child)]:mb-10"
          >
            {/* Node */}
            <span className="absolute left-4 top-2 z-10 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-background ring-2 ring-primary md:left-1/2">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-secondary" />
            </span>

            <motion.div
              variants={fadeUp}
              className={`glass rounded-2xl p-6 shadow-lg shadow-black/10 sm:p-8 md:max-w-xl ${
                i % 2 === 0
                  ? 'md:ml-[calc(50%+2rem)]'
                  : 'md:mr-[calc(50%+2rem)]'
              }`}
            >
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-xl text-secondary ring-1 ring-inset ring-white/5">
                    <HiOutlineBriefcase />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-text">
                      {job.role}
                      {job.company && (
                        <span className="text-secondary"> · {job.company}</span>
                      )}
                    </h3>
                    <p className="text-sm text-muted">{job.summary}</p>
                  </div>
                </div>
                <span className="rounded-full border border-border-strong bg-surface/60 px-3 py-1 text-xs font-semibold text-secondary">
                  {job.period}
                </span>
              </div>

              <ul className="grid gap-3">
                {job.points.map((point) => (
                  <motion.li
                    key={point}
                    variants={fadeUp}
                    className="flex items-start gap-3 text-sm leading-relaxed text-muted"
                  >
                    <HiCheckCircle className="mt-0.5 shrink-0 text-base text-primary" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>

              {job.tech && (
                <motion.div
                  variants={fadeUp}
                  className="mt-6 border-t border-border pt-5"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    Technologies Used
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
