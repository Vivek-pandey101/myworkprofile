import { motion } from 'framer-motion'
import { HiArrowDown, HiOutlineEnvelope } from 'react-icons/hi2'
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi'
import { SiReact, SiNodedotjs, SiMongodb, SiTailwindcss } from 'react-icons/si'
import { profile } from '../data/content'
import profileImage from '../assets/profileImage'
import Button from './ui/Button'
import { fadeUp, stagger } from './ui/motion'

const socials = [
  { icon: FiGithub, href: profile.github, label: 'GitHub' },
  { icon: FiLinkedin, href: profile.linkedin, label: 'LinkedIn' },
  { icon: FiMail, href: `mailto:${profile.email}`, label: 'Email' },
]

const floatingTech = [
  { icon: SiReact, className: 'left-[-1.5rem] top-10', delay: 0 },
  { icon: SiNodedotjs, className: 'right-[-1rem] top-24', delay: 1.2 },
  { icon: SiMongodb, className: 'left-[-1rem] bottom-24', delay: 0.6 },
  { icon: SiTailwindcss, className: 'right-[-1.5rem] bottom-12', delay: 1.8 },
]

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-32 sm:px-8"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: copy */}
        <motion.div
          variants={stagger(0.12, 0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-6"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            Available for new opportunities
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="text-gradient">{profile.name}</span>
          </motion.h1>

          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-primary to-secondary" />
            <p className="text-lg font-semibold text-gradient-brand sm:text-xl">
              {profile.role}
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-lg font-medium text-text/90"
          >
            {profile.tagline}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-base leading-relaxed text-muted"
          >
            {profile.intro}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-2 flex flex-wrap items-center gap-4"
          >
            <Button href="#projects" variant="primary">
              View Projects
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>
            <Button href="#contact" variant="secondary">
              <HiOutlineEnvelope size={18} />
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-2 flex items-center gap-3"
          >
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface/60 text-muted transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:text-text"
              >
                <Icon size={19} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: profile visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm"
        >
          {/* Glow ring */}
          <div className="absolute inset-0 -z-10 animate-float rounded-[2rem] bg-gradient-to-tr from-primary/40 via-secondary/20 to-transparent blur-2xl" />

          <div className="glass-strong relative overflow-hidden rounded-[2rem] p-2">
            {/* Avatar */}
            <div className="relative aspect-square overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-surface via-surface-2 to-background">
              {profileImage ? (
                <>
                  <img
                    src={profileImage}
                    alt={`${profile.name} — ${profile.role}`}
                    loading="eager"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-grid opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="select-none font-display text-[8rem] font-extrabold leading-none text-transparent"
                      style={{ WebkitTextStroke: '1.5px rgba(148,163,184,0.35)' }}
                    >
                      VKP
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-display text-5xl font-bold text-white shadow-2xl shadow-primary/30 ring-8 ring-background/40">
                      VKP
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 to-transparent" />
                </>
              )}
            </div>

            {/* Name plate */}
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="font-display text-sm font-semibold text-text">
                  {profile.name}
                </p>
                <p className="text-xs text-muted">{profile.role}</p>
              </div>
              <span className="rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-secondary">
                Open
              </span>
            </div>
          </div>

          {/* Floating tech chips */}
          {floatingTech.map(({ icon: Icon, className, delay }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.15, type: 'spring', stiffness: 200 }}
              className={`absolute ${className} flex h-14 w-14 items-center justify-center rounded-2xl glass-strong text-xl text-text shadow-xl shadow-black/30 animate-float`}
              style={{ animationDelay: `${delay}s` }}
            >
              <Icon />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted md:flex"
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          <HiArrowDown />
        </motion.span>
      </motion.a>
    </section>
  )
}
