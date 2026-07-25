import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { HiOutlineSparkles, HiOutlineLockClosed } from 'react-icons/hi2'
import Section, { SectionHeading } from './ui/Section'
import { projects } from '../data/content'
import { fadeUp, stagger } from './ui/motion'

function ProjectVisual({ project }) {
  const [from, to] = project.gradient
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Mock browser window */}
      <div className="absolute inset-x-5 bottom-0 top-8 overflow-hidden rounded-t-xl border border-white/15 bg-background/70 backdrop-blur-md">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          <span className="ml-3 h-4 flex-1 rounded bg-white/10" />
        </div>
        <div className="space-y-2.5 p-4">
          <div className="h-3 w-2/3 rounded bg-white/15" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 rounded-lg bg-white/10" />
            <div className="h-10 rounded-lg bg-white/10" />
            <div className="h-10 rounded-lg bg-white/10" />
          </div>
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-4/5 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/10" />
        </div>
      </div>

      {/* Big initial watermark */}
      <span className="absolute right-4 top-3 font-display text-4xl font-extrabold text-white/25">
        {project.name.charAt(0)}
      </span>
    </div>
  )
}

export default function Projects() {
  return (
    <Section id="projects">
      <div className="flex flex-col items-center">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Products I've designed & built"
          description="A selection of CRM platforms and business applications shipped to production."
        />
      </div>

      <motion.div
        variants={stagger(0.15, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mt-16 flex flex-col gap-8"
      >
        {projects.map((project, i) => (
          <motion.article
            key={project.name}
            variants={fadeUp}
            className="group relative grid overflow-hidden rounded-3xl border border-border bg-surface/50 backdrop-blur transition-colors hover:border-border-strong lg:grid-cols-2"
          >
            {/* Visual */}
            <div
              className={`p-6 sm:p-8 ${i % 2 === 1 ? 'lg:order-2' : ''}`}
            >
              <motion.div
                whileHover={{ scale: 1.02, rotate: -0.4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <ProjectVisual project={project} />
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary">
                  <HiOutlineSparkles className="text-sm" />
                  {project.category}
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
                  {project.tagline}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-text sm:text-3xl">
                {project.name}
              </h3>

              <p className="text-sm leading-relaxed text-muted sm:text-base">
                {project.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {project.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-lg border border-border bg-background/50 px-3 py-1.5 text-xs font-medium text-text/80"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Contribution */}
              <div className="rounded-xl border border-border bg-background/40 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-secondary">
                  My Contribution
                </p>
                <p className="text-sm leading-relaxed text-muted">
                  {project.contribution}
                </p>
              </div>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Actions — only real, public links are shown; no GitHub */}
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {project.live && (
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-hover"
                  >
                    Live Demo
                    <FiArrowUpRight />
                  </motion.a>
                )}
                {project.website && (
                  <motion.a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-hover"
                  >
                    View Website
                    <FiArrowUpRight />
                  </motion.a>
                )}
                {!project.live && !project.website && project.note && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-surface/60 px-4 py-2.5 text-sm font-medium text-muted">
                    <HiOutlineLockClosed className="text-base" />
                    {project.note}
                  </span>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  )
}
