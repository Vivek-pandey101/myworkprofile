import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from 'react-icons/fi'
import { navLinks, profile } from '../data/content'

const socials = [
  { icon: FiGithub, href: profile.github, label: 'GitHub' },
  { icon: FiLinkedin, href: profile.linkedin, label: 'LinkedIn' },
  { icon: FiMail, href: `mailto:${profile.email}`, label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-14 sm:px-8">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          {/* Brand */}
          <div className="max-w-sm">
            <a href="#home" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary font-display text-base font-bold text-white">
                V
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {profile.role} building scalable web applications, CRM platforms,
              and business solutions.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
              Navigation
            </h4>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
              Connect
            </h4>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface/60 text-muted transition-all hover:-translate-y-1 hover:border-border-strong hover:text-text"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-text"
          >
            Back to top
            <FiArrowUp />
          </a>
        </div>
      </div>
    </footer>
  )
}
