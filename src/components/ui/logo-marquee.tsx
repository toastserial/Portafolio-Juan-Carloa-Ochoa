import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { memo, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ComponentType, ReactNode } from 'react'

export type Logo = {
  alt: string
  color: string
  icon: ComponentType<{
    'aria-hidden'?: boolean
    size?: number | string
    style?: CSSProperties
  }>
}

interface InfiniteSliderProps {
  children: ReactNode
  gap?: number
  duration?: number
  durationOnHover?: number
  reverse?: boolean
  className?: string
}

const InfiniteSlider = memo(function InfiniteSlider({
  children,
  gap = 42,
  duration = 80,
  durationOnHover = 25,
  reverse = false,
  className = '',
}: InfiniteSliderProps) {
  const [contentWidth, setContentWidth] = useState(0)
  const firstSetRef = useRef<HTMLDivElement>(null)
  const translation = useMotionValue(0)
  const cycleRef = useRef(0)
  const positionRef = useRef(0)
  const durationRef = useRef(duration)
  const hasMeasuredRef = useRef(false)

  useEffect(() => {
    const element = firstSetRef.current
    if (!element) return
    const measure = () => setContentWidth(element.getBoundingClientRect().width)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [children, gap])

  useEffect(() => {
    if (!contentWidth) return
    const nextCycle = contentWidth + gap
    const previousCycle = cycleRef.current
    if (!hasMeasuredRef.current || !previousCycle) {
      positionRef.current = reverse ? -nextCycle : 0
    } else if (previousCycle !== nextCycle) {
      // Preserve the current phase when fonts, viewport size, or the logo set
      // changes. Re-measuring must never make the marquee jump to its start.
      positionRef.current = (positionRef.current / previousCycle) * nextCycle
    }
    cycleRef.current = nextCycle
    hasMeasuredRef.current = true
    translation.set(positionRef.current)
  }, [contentWidth, gap, reverse, translation])

  useEffect(() => {
    durationRef.current = duration
  }, [duration])

  useAnimationFrame((_, delta) => {
    const cycle = cycleRef.current
    if (!cycle) return
    const distance = (cycle / Math.max(durationRef.current, 1)) * (delta / 1000)
    let nextPosition = positionRef.current + (reverse ? distance : -distance)
    if (reverse) {
      while (nextPosition >= 0) nextPosition -= cycle
    } else {
      while (nextPosition <= -cycle) nextPosition += cycle
    }
    positionRef.current = nextPosition
    translation.set(nextPosition)
  })

  return (
    <div
      className={`logo-marquee-slider ${className}`.trim()}
      onPointerEnter={() => { durationRef.current = durationOnHover }}
      onPointerLeave={() => { durationRef.current = duration }}
    >
      <motion.div className="logo-marquee-track" style={{ gap, x: translation }}>
        <div className="logo-marquee-set" ref={firstSetRef}>
          {children}
        </div>
        <div aria-hidden="true" className="logo-marquee-set">
          {children}
        </div>
      </motion.div>
    </div>
  )
})

function LogoMark({ logo }: { logo: Logo }) {
  const Icon = logo.icon
  return (
    <span aria-label={logo.alt} className="logo-marquee-logo" title={logo.alt}>
      <Icon aria-hidden={true} size="2rem" style={{ color: 'var(--color-accent)' }} />
    </span>
  )
}

export const LogoMarquee = memo(function LogoMarquee({
  logos,
  ariaLabel = 'Technology logos',
  className = '',
}: {
  logos: Logo[]
  ariaLabel?: string
  className?: string
}) {
  return (
    <div aria-label={ariaLabel} className={`logo-marquee ${className}`.trim()} role="list">
      <InfiniteSlider>
        {logos.map((logo) => <LogoMark key={logo.alt} logo={logo} />)}
      </InfiniteSlider>
    </div>
  )
})

LogoMarquee.displayName = 'LogoMarquee'

export default LogoMarquee
