import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowLeft, HiOutlineLanguage } from 'react-icons/hi2'
import { getGuides } from '../data/skillGuides'
import { slugify } from '../data/skillGuideMeta'
import { profile } from '../data/content'
import { getInitialLang, storeLang, t } from '../lib/i18n'
import SkillGuideDetail from '../components/SkillGuideDetail'
import Background from '../components/ui/Background'

const homeUrl = import.meta.env.BASE_URL // e.g. /myworkprofile/
const names = Object.keys(getGuides('en'))

export default function SkillReference() {
  // Preselect the tab from ?skill=<slug>, defaulting to the first guide.
  const initial = useMemo(() => {
    const param = new URLSearchParams(window.location.search).get('skill')
    return names.find((n) => slugify(n) === param) || names[0]
  }, [])

  const [active, setActive] = useState(initial)
  const [lang, setLang] = useState(getInitialLang)

  const T = t(lang)
  const guide = getGuides(lang)[active]

  // Keep the URL, <html lang> and document title in sync with the selection.
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('skill', slugify(active))
    url.searchParams.set('lang', lang)
    window.history.replaceState(null, '', url)
    document.documentElement.lang = lang
    document.title = `${active} — ${T.pageTitle} — ${profile.name}`
  }, [active, lang, T.pageTitle])

  const changeSkill = (name) => {
    setActive(name)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleLang = () => {
    const next = lang === 'en' ? 'hi' : 'en'
    setLang(next)
    storeLang(next)
  }

  return (
    <div className="relative min-h-screen">
      <Background />

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border glass-strong">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
          <a
            href={homeUrl}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-text"
          >
            <HiArrowLeft />
            <span className="hidden sm:inline">{T.back}</span>
          </a>

          <button
            type="button"
            onClick={toggleLang}
            aria-label={T.switchTo}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            <HiOutlineLanguage className="text-base" />
            {T.switchTo}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-8">
        {/* Heading */}
        <div className="mb-7">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            {T.referenceBadge}
          </p>
          <h1 className="font-display text-3xl font-bold text-gradient sm:text-4xl">
            {T.pageTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {T.pageIntro}
          </p>
        </div>

        {/* Skill tabs. top-[3.7rem] is the sticky header's height, so the
            tabs park directly under it instead of sliding behind it. */}
        <div
          role="tablist"
          aria-label={T.skills}
          className="sticky top-[3.7rem] z-20 -mx-5 mb-8 flex gap-2 overflow-x-auto border-b border-border bg-background/80 px-5 py-3 backdrop-blur"
        >
          {names.map((name) => {
            const isActive = name === active
            return (
              <button
                key={name}
                role="tab"
                aria-selected={isActive}
                onClick={() => changeSkill(name)}
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
                <span className="relative z-10">{name}</span>
              </button>
            )
          })}
        </div>

        {/* Active guide */}
        <div className="mb-7">
          <h2 className="font-display text-2xl font-bold text-gradient-brand">{guide.name}</h2>
          <p className="mt-1 text-sm text-muted">{guide.tagline}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${lang}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <SkillGuideDetail guide={guide} lang={lang} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
