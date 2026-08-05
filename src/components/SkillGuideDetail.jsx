import { useState } from 'react'
import {
  HiChevronDown,
  HiOutlineClipboard,
  HiOutlineCheck,
  HiOutlineLightBulb,
  HiOutlineExclamationTriangle,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineBolt,
  HiOutlineRocketLaunch,
  HiOutlineCommandLine,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineCursorArrowRays,
  HiOutlineWrenchScrewdriver,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
} from 'react-icons/hi2'
import GuideDiagram from './ui/GuideDiagram'
import { t } from '../lib/i18n'

/* -------- Copyable code block -------- */
function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard may be blocked; ignore */
    }
  }

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg border border-border bg-[#0b1120] p-3 pr-11 text-[0.8rem] leading-relaxed text-secondary">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy"
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:text-text"
      >
        {copied ? <HiOutlineCheck className="text-secondary" /> : <HiOutlineClipboard />}
      </button>
    </div>
  )
}

/* -------- Labelled callout (two tones only, to keep the page calm) -------- */
function Callout({ icon: Icon, label, children, tone = 'teal' }) {
  const tones = {
    teal: 'border-secondary/25 bg-secondary/5 text-secondary/90',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-200/90',
  }
  return (
    <div className={`flex items-start gap-2 rounded-lg border p-2.5 text-sm ${tones[tone]}`}>
      <Icon className="mt-0.5 shrink-0" />
      <span className="whitespace-pre-line">
        {label && <span className="font-semibold">{label} </span>}
        {children}
      </span>
    </div>
  )
}

/* -------- code ↔ meaning rows, used for flags and file lines -------- */
function MeaningList({ items, keyOf, accent = 'text-primary' }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li
          key={keyOf(item)}
          className="flex flex-col gap-0.5 text-sm sm:flex-row sm:gap-2.5"
        >
          <code
            className={`shrink-0 rounded bg-surface px-1.5 py-0.5 text-xs font-semibold sm:max-w-[15rem] sm:truncate ${accent}`}
          >
            {keyOf(item)}
          </code>
          <span className="text-muted">{item.meaning ?? item.desc}</span>
        </li>
      ))}
    </ul>
  )
}

/* -------- Numbered top-level section -------- */
function GuideSection({ id, num, icon: Icon, title, blurb, children }) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="mb-4 border-b border-border pb-3">
        <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold text-text">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {num}
          </span>
          <Icon className="shrink-0 text-secondary" />
          {title}
        </h3>
        {blurb && <p className="mt-1.5 pl-[2.4rem] text-sm text-muted">{blurb}</p>}
      </div>
      {children}
    </section>
  )
}

/* -------- Collapsible block -------- */
function Collapsible({ title, count, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/5"
      >
        <span className="flex items-center gap-2.5 font-display text-sm font-semibold text-text">
          {title}
          {count != null && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {count}
            </span>
          )}
        </span>
        <HiChevronDown
          className={`shrink-0 text-muted transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-border p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

/* -------- A file the reader has to create, with save instructions -------- */
function FileCard({ file, T }) {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/25 bg-background/50">
      <div className="flex flex-wrap items-center gap-2 border-b border-primary/20 bg-primary/10 px-3 py-2">
        <HiOutlineDocumentText className="shrink-0 text-primary" />
        <code className="min-w-0 flex-1 truncate text-xs font-semibold text-text">
          {file.path}
        </code>
        <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-primary">
          {file.label || T.createFile}
        </span>
      </div>

      <div className="space-y-3 p-3">
        <CodeBlock code={file.content} />

        {file.save && (
          <Callout icon={HiOutlineCheckCircle} label={T.howToSave}>
            {file.save}
          </Callout>
        )}

        {file.lines?.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              {T.lineByLine}
            </p>
            <MeaningList
              items={file.lines}
              keyOf={(l) => l.key}
              accent="text-secondary"
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* -------- One numbered walkthrough step -------- */
function WalkthroughStep({ step, index, last, T }) {
  return (
    <li className="relative pl-10 sm:pl-12">
      <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-sm font-bold text-primary">
        {index + 1}
      </span>
      {!last && (
        <span
          aria-hidden
          className="absolute left-4 top-9 h-[calc(100%-1.5rem)] w-px bg-border"
        />
      )}

      <div className="space-y-3 pb-9">
        <div>
          <h4 className="font-display text-base font-semibold text-text">{step.title}</h4>
          {step.why && (
            <p className="mt-1 text-sm leading-relaxed text-muted">
              <span className="font-semibold text-secondary">{T.why} </span>
              {step.why}
            </p>
          )}
        </div>

        {step.ui?.length > 0 && (
          <div>
            <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <HiOutlineCursorArrowRays className="text-secondary" />
              {T.inDashboard}
            </p>
            <ol className="space-y-1.5">
              {step.ui.map((u, i) => (
                <li key={u} className="flex gap-2 text-sm text-text/85">
                  <span className="shrink-0 font-semibold text-primary">{i + 1}.</span>
                  {u}
                </li>
              ))}
            </ol>
          </div>
        )}

        {step.code && (
          <div>
            <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <HiOutlineCommandLine className="text-secondary" />
              {T.inTerminal}
            </p>
            <CodeBlock code={step.code} />
          </div>
        )}

        {step.explain?.length > 0 && (
          <MeaningList items={step.explain} keyOf={(e) => e.part} />
        )}

        {step.file && <FileCard file={step.file} T={T} />}

        {step.check && (
          <Callout icon={HiOutlineCheckCircle} label={T.worksWhen}>
            {step.check}
          </Callout>
        )}

        {step.note && (
          <Callout icon={HiOutlineExclamationTriangle} label={T.watchOut} tone="amber">
            {step.note}
          </Callout>
        )}
      </div>
    </li>
  )
}

/* -------- One command entry (reference section) -------- */
function CommandCard({ command, T }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <CodeBlock code={command.cmd} />

      <p className="mt-3 text-sm text-text/90">
        <span className="font-semibold text-text">{T.purpose} </span>
        {command.purpose}
      </p>

      {command.flags?.length > 0 && (
        <div className="mt-3">
          <MeaningList items={command.flags} keyOf={(f) => f.flag} />
        </div>
      )}

      <div className="mt-3 space-y-1 text-sm">
        <p className="text-muted">
          <span className="font-semibold text-text">{T.example} </span>
          <code className="text-secondary">{command.example}</code>
        </p>
        <p className="text-muted">
          <span className="font-semibold text-text">{T.result} </span>
          {command.output}
        </p>
      </div>

      <div className="mt-3">
        <Callout icon={HiOutlineExclamationTriangle} label={T.watchOut} tone="amber">
          {command.mistake}
        </Callout>
      </div>
    </div>
  )
}

const groupMeta = {
  Security: { icon: HiOutlineShieldCheck, color: 'text-secondary' },
  Performance: { icon: HiOutlineBolt, color: 'text-amber-400' },
  Production: { icon: HiOutlineRocketLaunch, color: 'text-primary' },
}

/**
 * One skill guide, read top to bottom: plain-language intro → jargon →
 * step-by-step walkthrough (with every config file written out) → what to do
 * when it breaks. Everything that is lookup material rather than reading
 * material sits collapsed in the last section.
 */
export default function SkillGuideDetail({ guide, lang = 'en' }) {
  const T = t(lang)

  const sections = [
    { id: 'start', label: T.navStart },
    guide.glossary && { id: 'words', label: T.navWords },
    guide.walkthrough && { id: 'steps', label: T.navSteps },
    guide.troubleshooting && { id: 'fixes', label: T.navFixes },
    { id: 'reference', label: T.navReference },
  ].filter(Boolean)

  const numOf = (id) => sections.findIndex((s) => s.id === id) + 1
  const commandCount = guide.categories.reduce((n, c) => n + c.commands.length, 0)

  return (
    <div className="space-y-12">
      {/* Jump nav */}
      <nav className="flex flex-wrap gap-2">
        {sections.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-text"
          >
            <span className="font-bold text-primary">{i + 1}</span>
            {s.label}
          </a>
        ))}
      </nav>

      {/* ---------------- 1. Start here ---------------- */}
      <GuideSection
        id="start"
        num={numOf('start')}
        icon={HiOutlineAcademicCap}
        title={T.startTitle}
      >
        <div className="space-y-4">
          {guide.beginner?.simple && (
            <div className="rounded-xl border border-border bg-surface/40 p-4 sm:p-5">
              <p className="text-[0.95rem] leading-relaxed text-text/90">
                {guide.beginner.simple}
              </p>
              {guide.beginner.analogy && (
                <p className="mt-3 border-l-2 border-secondary/50 pl-3 text-sm italic leading-relaxed text-secondary/90">
                  {guide.beginner.analogy}
                </p>
              )}
            </div>
          )}

          {guide.diagram && <GuideDiagram name={guide.diagram} />}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
                {T.inOneLine}
              </p>
              <p className="text-sm leading-relaxed text-muted">{guide.overview.what}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-secondary">
                {T.whyUsed}
              </p>
              <p className="text-sm leading-relaxed text-muted">{guide.overview.why}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {guide.beginner?.before?.length > 0 && (
              <div className="rounded-xl border border-border bg-surface/40 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                  {T.before}
                </p>
                <ul className="space-y-1.5">
                  {guide.beginner.before.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted">
                      <HiOutlineCheckCircle className="mt-0.5 shrink-0 text-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-border bg-surface/40 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                {T.useCases}
              </p>
              <ul className="space-y-1.5">
                {guide.overview.useCases.map((u) => (
                  <li key={u} className="flex items-start gap-2 text-sm text-muted">
                    <HiOutlineSparkles className="mt-0.5 shrink-0 text-primary" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </GuideSection>

      {/* ---------------- 2. Key words ---------------- */}
      {guide.glossary?.length > 0 && (
        <GuideSection
          id="words"
          num={numOf('words')}
          icon={HiOutlineBookOpen}
          title={T.wordsTitle}
          blurb={T.wordsBlurb}
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {guide.glossary.map((g) => (
              <div key={g.term} className="rounded-xl border border-border bg-surface/40 p-3.5">
                <p className="text-sm font-semibold text-text">{g.term}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{g.meaning}</p>
              </div>
            ))}
          </div>
        </GuideSection>
      )}

      {/* ---------------- 3. Step by step ---------------- */}
      {guide.walkthrough && (
        <GuideSection
          id="steps"
          num={numOf('steps')}
          icon={HiOutlineRocketLaunch}
          title={guide.walkthrough.title}
          blurb={guide.walkthrough.intro}
        >
          <ol>
            {guide.walkthrough.steps.map((step, i) => (
              <WalkthroughStep
                key={step.title}
                step={step}
                index={i}
                last={i === guide.walkthrough.steps.length - 1}
                T={T}
              />
            ))}
          </ol>
        </GuideSection>
      )}

      {/* ---------------- 4. When it breaks ---------------- */}
      {guide.troubleshooting?.length > 0 && (
        <GuideSection
          id="fixes"
          num={numOf('fixes')}
          icon={HiOutlineWrenchScrewdriver}
          title={T.fixesTitle}
          blurb={T.fixesBlurb}
        >
          <div className="space-y-2.5">
            {guide.troubleshooting.map((tr) => (
              <div key={tr.problem} className="rounded-xl border border-border bg-surface/40 p-4">
                <p className="flex items-start gap-2 text-sm font-semibold text-text">
                  <HiOutlineExclamationTriangle className="mt-0.5 shrink-0 text-amber-400" />
                  <code className="text-amber-200/90">{tr.problem}</code>
                </p>
                <p className="mt-2 text-sm text-muted">
                  <span className="font-semibold text-text/80">{T.cause} </span>
                  {tr.cause}
                </p>
                <p className="mt-1 text-sm text-muted">
                  <span className="font-semibold text-secondary">{T.fix} </span>
                  {tr.fix}
                </p>
              </div>
            ))}
          </div>
        </GuideSection>
      )}

      {/* ---------------- 5. Reference (collapsed by default) ---------------- */}
      <GuideSection
        id="reference"
        num={numOf('reference')}
        icon={HiOutlineCommandLine}
        title={T.referenceTitle}
        blurb={T.referenceBlurb}
      >
        <div className="space-y-3">
          <Collapsible title={T.commandsTitle} count={commandCount}>
            <div className="space-y-6">
              {guide.categories.map((cat) => (
                <div key={cat.name} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    {cat.name}
                  </p>
                  {cat.commands.map((command) => (
                    <CommandCard key={command.cmd} command={command} T={T} />
                  ))}
                </div>
              ))}
            </div>
          </Collapsible>

          <Collapsible title={T.scenariosTitle} count={guide.scenarios.length}>
            <div className="grid gap-3 sm:grid-cols-2">
              {guide.scenarios.map((s) => (
                <div key={s.title} className="rounded-xl border border-border bg-background/40 p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
                    <HiOutlineLightBulb className="shrink-0 text-secondary" />
                    {s.title}
                  </p>
                  <ol className="space-y-1.5">
                    {s.steps.map((step, idx) => (
                      <li key={step} className="flex gap-2 text-sm text-muted">
                        <span className="shrink-0 font-semibold text-primary">{idx + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Collapsible>

          <Collapsible title={T.practicesTitle} count={guide.bestPractices.length}>
            <div className="grid gap-3 sm:grid-cols-3">
              {guide.bestPractices.map((bp) => {
                const meta = groupMeta[bp.group] || groupMeta.Production
                const Icon = meta.icon
                return (
                  <div
                    key={bp.group}
                    className="rounded-xl border border-border bg-background/40 p-4"
                  >
                    <p className={`mb-2 flex items-center gap-2 text-sm font-semibold ${meta.color}`}>
                      <Icon />
                      {bp.group}
                    </p>
                    <ul className="space-y-1.5">
                      {bp.items.map((item) => (
                        <li key={item} className="text-sm leading-relaxed text-muted">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </Collapsible>

          {lang === 'hi' && <p className="text-xs text-muted">{T.referenceNote}</p>}
        </div>
      </GuideSection>
    </div>
  )
}
