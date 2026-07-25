import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi'
import {
  HiOutlinePaperAirplane,
  HiCheckCircle,
  HiExclamationTriangle,
} from 'react-icons/hi2'
import Section, { SectionHeading } from './ui/Section'
import { profile } from '../data/content'
import { fadeUp, stagger, viewportOnce } from './ui/motion'

/* EmailJS config — values come from .env.local (see .env.example) */
const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}
const emailjsConfigured = Boolean(
  EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey,
)

const channels = [
  {
    icon: FiMail,
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    value: 'Connect with me',
    href: profile.linkedin,
  },
  {
    icon: FiGithub,
    label: 'GitHub',
    value: 'View my work',
    href: profile.github,
  },
]

const initialForm = { name: '', email: '', subject: '', message: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!form.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.subject.trim()) errors.subject = 'Please add a subject.'
  if (!form.message.trim()) {
    errors.message = 'Please write a message.'
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.'
  }
  return errors
}

function Field({ label, name, type = 'text', value, onChange, error, textarea, ...rest }) {
  const Comp = textarea ? 'textarea' : 'input'
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-text/90">
        {label}
      </label>
      <Comp
        id={name}
        name={name}
        type={textarea ? undefined : type}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border bg-background/60 px-4 py-3 text-sm text-text placeholder:text-muted/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 ${
          error ? 'border-red-500/60' : 'border-border'
        } ${textarea ? 'min-h-32 resize-y' : ''}`}
        {...rest}
      />
      <AnimatePresence>
        {error && (
          <motion.span
            id={`${name}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-medium text-red-400"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  // status: 'idle' | 'sending' | 'sent' | 'error'
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
    if (status !== 'idle' && status !== 'sending') setStatus('idle')
  }

  const sendViaMailto = () => {
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`,
    )
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      form.subject,
    )}&body=${body}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(form)
    if (Object.keys(found).length) {
      setErrors(found)
      return
    }

    // Without EmailJS credentials, fall back to the visitor's mail client.
    if (!emailjsConfigured) {
      sendViaMailto()
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          from_name: form.name,
          reply_to: form.email,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
          to_email: profile.email,
        },
        { publicKey: EMAILJS.publicKey },
      )
      setStatus('sent')
      setForm(initialForm)
      setTimeout(() => setStatus('idle'), 6000)
    } catch (err) {
      console.error('EmailJS send failed:', err)
      setStatus('error')
    }
  }

  const sending = status === 'sending'

  return (
    <Section id="contact">
      <div className="flex flex-col items-center">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's build something great"
          description="Have a project in mind or a role to fill? I'd love to hear from you."
        />
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left: channels */}
        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-col gap-4"
        >
          <motion.p variants={fadeUp} className="text-sm leading-relaxed text-muted">
            Prefer a direct line? Reach out through any of these channels and I'll
            get back to you promptly.
          </motion.p>

          {channels.map(({ icon: Icon, label, value, href }) => (
            <motion.a
              key={label}
              variants={fadeUp}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/50 p-4 backdrop-blur transition-colors hover:border-border-strong"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-xl text-secondary ring-1 ring-inset ring-white/5">
                <Icon />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  {label}
                </p>
                <p className="truncate text-sm font-semibold text-text">{value}</p>
              </div>
              <FiArrowUpRight className="ml-auto text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text" />
            </motion.a>
          ))}
        </motion.div>

        {/* Right: form */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          onSubmit={handleSubmit}
          noValidate
          className="glass-strong flex flex-col gap-5 rounded-3xl p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Your name"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
            />
          </div>
          <Field
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            error={errors.subject}
            placeholder="What's this about?"
          />
          <Field
            label="Message"
            name="message"
            textarea
            value={form.message}
            onChange={handleChange}
            error={errors.message}
            placeholder="Tell me about your project..."
          />

          <motion.button
            type="submit"
            disabled={sending}
            whileHover={sending ? undefined : { y: -2 }}
            whileTap={sending ? undefined : { scale: 0.98 }}
            className="group relative mt-1 inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="pointer-events-none absolute inset-0 overflow-hidden">
              <span className="absolute -inset-x-4 -top-1 h-full -translate-x-full skew-x-12 bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-[220%]" />
            </span>
            <span className="relative z-10 inline-flex items-center gap-2">
              {sending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <HiOutlinePaperAirplane className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </span>
          </motion.button>

          <AnimatePresence mode="wait">
            {status === 'sent' && (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-4 py-3 text-sm font-medium text-secondary"
              >
                <HiCheckCircle className="shrink-0 text-lg" />
                Thanks! Your message has been sent — I&apos;ll get back to you soon.
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300"
              >
                <HiExclamationTriangle className="shrink-0 text-lg" />
                <span>
                  Something went wrong. Please email me directly at{' '}
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-semibold underline"
                  >
                    {profile.email}
                  </a>
                  .
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </Section>
  )
}
