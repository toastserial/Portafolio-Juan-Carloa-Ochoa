import type { ReactNode } from 'react'

interface SectionPlaceholderProps {
  id: string
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}

export function SectionPlaceholder({
  id,
  eyebrow,
  title,
  description,
  children,
}: SectionPlaceholderProps) {
  return (
    <section className="section-shell scroll-mt-24" id={id}>
      <div className="max-w-3xl">
        <p className="technical-label">{eyebrow}</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">
          {description}
        </p>
        {children}
      </div>
    </section>
  )
}

