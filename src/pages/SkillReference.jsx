import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowLeft } from 'react-icons/hi2'
import { skillGuides } from '../data/skillGuides'
import { slugify } from '../data/skillGuideMeta'
import { profile } from '../data/content'
import SkillGuideDetail from '../components/SkillGuideDetail'
import Background from '../components/ui/Background'

const guides = Object.values(skillGuides)
const homeUrl = import.meta.env.BASE_URL // e.g. /myworkprofile/

export default function SkillReference() {
  // Preselect the tab from ?skill=<slug>, defaulting to the first guide.
  const initial = useMemo(() => {
    const param = new URLSearchParams(window.location.search).get('skill')
    const match = guides.find((g) => slugify(g.name) === param)
    return match ? match.name : guides[0].name
  }, [])

  const [active, setActive] = useState(initial)
  const guide = skillGuides[active]

  // Keep the URL and document title in sync with the active tab.
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('skill', slugify(active))
    window.history.replaceState(null, '', url)
    document.title = `${active} Reference — ${profile.name}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [active])

  return (
    <div className="relative min-h-screen">
      <Background />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border glass-strong">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
          <a
            href={homeUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-text"
          >
            <HiArrowLeft />
            Back to portfolio
          </a>
          <span className="flex items-center gap-2 text-sm font-semibold text-text">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
              V
            </span>
            <span className="hidden font-display sm:block">Skill Reference</span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-10">
        {/* Heading */}
        <div className="mb-8">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Technical Reference
          </p>
          <h1 className="font-display text-3xl font-bold text-gradient sm:text-4xl">
            Command &amp; Skills Guide
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
            Real, verified commands with explanations, examples, and best
            practices for the infrastructure and tooling I work with.
          </p>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Skills"
          className="sticky top-[3.75rem] z-20 -mx-5 mb-8 flex gap-2 overflow-x-auto border-b border-border bg-background/80 px-5 py-3 backdrop-blur"
        >
          {guides.map((g) => {
            const isActive = g.name === active
            return (
              <button
                key={g.name}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(g.name)}
                className={`relative shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-text' : 'text-muted hover:text-text'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-lg border border-primary/40 bg-primary/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{g.name}</span>
              </button>
            )
          })}
        </div>

        {/* Active guide */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-gradient-brand">
            {guide.name}
          </h2>
          <p className="mt-1 text-sm text-muted">{guide.tagline}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <SkillGuideDetail guide={guide} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
