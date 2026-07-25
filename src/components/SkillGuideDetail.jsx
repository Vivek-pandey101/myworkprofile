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
} from 'react-icons/hi2'

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
        aria-label="Copy command"
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:text-text"
      >
        {copied ? (
          <HiOutlineCheck className="text-secondary" />
        ) : (
          <HiOutlineClipboard />
        )}
      </button>
    </div>
  )
}

/* -------- One command entry -------- */
function CommandCard({ command }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <CodeBlock code={command.cmd} />

      <p className="mt-3 text-sm text-text/90">
        <span className="font-semibold text-text">Purpose: </span>
        {command.purpose}
      </p>

      {command.flags?.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {command.flags.map((f) => (
            <li key={f.flag} className="flex gap-2 text-sm text-muted">
              <code className="shrink-0 rounded bg-surface px-1.5 py-0.5 text-xs font-semibold text-primary">
                {f.flag}
              </code>
              <span>{f.desc}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 space-y-1 text-sm">
        <p className="text-muted">
          <span className="font-semibold text-text">Example: </span>
          <code className="text-secondary">{command.example}</code>
        </p>
        <p className="text-muted">
          <span className="font-semibold text-text">Result: </span>
          {command.output}
        </p>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 text-sm text-amber-200/90">
        <HiOutlineExclamationTriangle className="mt-0.5 shrink-0 text-amber-400" />
        <span>
          <span className="font-semibold">Watch out: </span>
          {command.mistake}
        </span>
      </div>
    </div>
  )
}

/* -------- Collapsible category (CSS grid-rows animation, no JS measuring) -------- */
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

const groupMeta = {
  Security: { icon: HiOutlineShieldCheck, color: 'text-secondary' },
  Performance: { icon: HiOutlineBolt, color: 'text-amber-400' },
  Production: { icon: HiOutlineRocketLaunch, color: 'text-primary' },
}

/**
 * Full reference body for a single skill guide.
 * Used by the standalone SkillReference page.
 */
export default function SkillGuideDetail({ guide }) {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <section className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface/40 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-secondary">
              What it is
            </p>
            <p className="text-sm leading-relaxed text-muted">
              {guide.overview.what}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface/40 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-secondary">
              Why it is used
            </p>
            <p className="text-sm leading-relaxed text-muted">
              {guide.overview.why}
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface/40 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">
            Common use cases
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {guide.overview.useCases.map((u) => (
              <li key={u} className="flex items-start gap-2 text-sm text-muted">
                <HiOutlineSparkles className="mt-0.5 shrink-0 text-primary" />
                {u}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Command categories */}
      <section>
        <h3 className="mb-3 font-display text-lg font-semibold text-text">
          Commands by category
        </h3>
        <div className="space-y-3">
          {guide.categories.map((cat, i) => (
            <Collapsible
              key={cat.name}
              title={cat.name}
              count={cat.commands.length}
              defaultOpen={i === 0}
            >
              {cat.commands.map((command) => (
                <CommandCard key={command.cmd} command={command} />
              ))}
            </Collapsible>
          ))}
        </div>
      </section>

      {/* Practical scenarios */}
      <section>
        <h3 className="mb-3 font-display text-lg font-semibold text-text">
          Practical scenarios
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {guide.scenarios.map((s) => (
            <div
              key={s.title}
              className="rounded-xl border border-border bg-surface/40 p-4"
            >
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
                <HiOutlineLightBulb className="text-secondary" />
                {s.title}
              </p>
              <ol className="space-y-1.5">
                {s.steps.map((step, idx) => (
                  <li key={step} className="flex gap-2 text-sm text-muted">
                    <span className="shrink-0 font-semibold text-primary">
                      {idx + 1}.
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Best practices */}
      <section>
        <h3 className="mb-3 font-display text-lg font-semibold text-text">
          Best practices
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {guide.bestPractices.map((bp) => {
            const meta = groupMeta[bp.group] || groupMeta.Production
            const Icon = meta.icon
            return (
              <div
                key={bp.group}
                className="rounded-xl border border-border bg-surface/40 p-4"
              >
                <p
                  className={`mb-2 flex items-center gap-2 text-sm font-semibold ${meta.color}`}
                >
                  <Icon />
                  {bp.group}
                </p>
                <ul className="space-y-1.5">
                  {bp.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm leading-relaxed text-muted"
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
