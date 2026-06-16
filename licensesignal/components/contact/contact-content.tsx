'use client'

import { useState } from 'react'
import { CheckCircle2, Calendar, Mail, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SectionHeading } from '@/components/shared/section-heading'

const ROLE_OPTIONS = ['Sales / Business Development', 'Data & Analytics', 'Engineering', 'Executive / Founder', 'Other']
const USE_CASE_OPTIONS = [
  'Beverage Distribution',
  'Restaurant Supply',
  'POS / Technology',
  'Payroll / HR',
  'Market Intelligence',
  'Private Equity / VC',
  'Commercial Real Estate',
  'Other',
]

function FieldError({ message }: { message: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-red-400">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </span>
  )
}

type FormState = {
  name: string
  company: string
  email: string
  role: string
  useCase: string
  message: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FREE_EMAIL = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com']

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!form.company.trim()) errors.company = 'Please enter your company.'
  if (!form.email.trim()) {
    errors.email = 'Please enter your work email.'
  } else if (!EMAIL_RE.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
  } else if (FREE_EMAIL.includes(form.email.split('@')[1]?.toLowerCase())) {
    errors.email = 'Please use your work email, not a personal address.'
  }
  if (!form.role) errors.role = 'Please select your role.'
  if (!form.useCase) errors.useCase = 'Please select a use case.'
  return errors
}

export function ContactContent() {
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [form, setForm] = useState<FormState>({
    name: '',
    company: '',
    email: '',
    role: '',
    useCase: '',
    message: '',
  })

  const update = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }))
    // Clear a field's error as soon as the user edits it.
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setErrors({})
    setSubmitted(true)
  }

  return (
    <div>
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Form */}
            <div className="flex flex-col gap-6">
              <SectionHeading
                eyebrow="Contact"
                heading="Get API Access"
                subtext="Tell us about your use case and we'll get you set up with the right plan."
                align="left"
              />

              {submitted ? (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 flex flex-col items-center gap-4 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-[var(--ls-fg)]">Message received.</h3>
                  <p className="text-sm text-[var(--ls-fg-2)]">
                    We'll be in touch within 1 business day with access details and next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="name" className="text-xs text-[var(--ls-fg-2)]">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Jane Smith"
                        value={form.name}
                        aria-invalid={!!errors.name}
                        onChange={(e) => update('name', e.target.value)}
                        className={`bg-[var(--ls-surface)] text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 ${errors.name ? 'border-red-500/50' : 'border-[var(--ls-border-2)]'}`}
                      />
                      {errors.name && <FieldError message={errors.name} />}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="company" className="text-xs text-[var(--ls-fg-2)]">Company</Label>
                      <Input
                        id="company"
                        placeholder="Acme Corp"
                        value={form.company}
                        aria-invalid={!!errors.company}
                        onChange={(e) => update('company', e.target.value)}
                        className={`bg-[var(--ls-surface)] text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] focus-visible:ring-indigo-500/50 ${errors.company ? 'border-red-500/50' : 'border-[var(--ls-border-2)]'}`}
                      />
                      {errors.company && <FieldError message={errors.company} />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email" className="text-xs text-[var(--ls-fg-2)]">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@company.com"
                      value={form.email}
                      aria-invalid={!!errors.email}
                      onChange={(e) => update('email', e.target.value)}
                      className={`bg-[var(--ls-surface)] text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] focus-visible:ring-indigo-500/50 ${errors.email ? 'border-red-500/50' : 'border-[var(--ls-border-2)]'}`}
                    />
                    {errors.email && <FieldError message={errors.email} />}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-[var(--ls-fg-2)]">Your Role</Label>
                      <Select value={form.role} onValueChange={(v) => update('role', v as string)}>
                        <SelectTrigger className={`bg-[var(--ls-surface)] text-[var(--ls-fg)] focus:ring-indigo-500/50 ${errors.role ? 'border-red-500/50' : 'border-[var(--ls-border-2)]'}`}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--ls-surface)] border-[var(--ls-border-2)] text-[var(--ls-fg)]">
                          {ROLE_OPTIONS.map((r) => (
                            <SelectItem key={r} value={r} className="focus:bg-[var(--ls-hover)] focus:text-[var(--ls-fg)]">
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.role && <FieldError message={errors.role} />}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-xs text-[var(--ls-fg-2)]">Use Case</Label>
                      <Select value={form.useCase} onValueChange={(v) => update('useCase', v as string)}>
                        <SelectTrigger className={`bg-[var(--ls-surface)] text-[var(--ls-fg)] focus:ring-indigo-500/50 ${errors.useCase ? 'border-red-500/50' : 'border-[var(--ls-border-2)]'}`}>
                          <SelectValue placeholder="Select use case" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--ls-surface)] border-[var(--ls-border-2)] text-[var(--ls-fg)]">
                          {USE_CASE_OPTIONS.map((u) => (
                            <SelectItem key={u} value={u} className="focus:bg-[var(--ls-hover)] focus:text-[var(--ls-fg)]">
                              {u}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.useCase && <FieldError message={errors.useCase} />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="message" className="text-xs text-[var(--ls-fg-2)]">Tell us about your use case</Label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="What data are you looking for? How will you use it? What's your territory or market?"
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      className="w-full rounded-md border border-[var(--ls-border-2)] bg-[var(--ls-surface)] px-3 py-2 text-sm text-[var(--ls-fg)] placeholder:text-[var(--ls-fg-4)] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-[0_0_20px_rgba(99,102,241,0.3)] w-full"
                  >
                    Send Message
                  </Button>
                  <p className="text-xs text-[var(--ls-fg-3)] text-center">
                    We'll respond within 1 business day. No sales pressure.
                  </p>
                </form>
              )}
            </div>

            {/* Info panel */}
            <div className="flex flex-col gap-6 lg:pt-20">
              <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                    <Calendar className="h-4 w-4 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--ls-fg)]">Prefer a call?</h3>
                </div>
                <p className="text-sm text-[var(--ls-fg-2)]">
                  Book a 20-minute demo and we'll walk you through the data, show you a live API
                  call, and set up a test key on the spot.
                </p>
                <a
                  href="mailto:support@newvenuedata.com?subject=Book%20a%2020-minute%20demo"
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  Book a 20-min demo →
                </a>
              </div>

              <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                    <Mail className="h-4 w-4 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--ls-fg)]">Email us directly</h3>
                </div>
                <p className="text-sm text-[var(--ls-fg-2)]">
                  For support, data questions, or enterprise inquiries:
                </p>
                <a
                  href="mailto:support@newvenuedata.com"
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  support@newvenuedata.com
                </a>
              </div>

              <div className="rounded-xl border border-[var(--ls-border)] bg-[var(--ls-surface)] p-6">
                <p className="text-xs text-[var(--ls-fg-3)] leading-relaxed">
                  <span className="text-[var(--ls-fg-2)] font-medium">Response time: </span>
                  We respond to all inquiries within 1 business day.
                  Enterprise and data partnership inquiries are typically handled same-day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
