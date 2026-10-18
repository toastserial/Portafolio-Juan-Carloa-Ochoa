import { useReducedMotion } from 'framer-motion'
import { useEffect, useId, useRef } from 'react'
import type { PointerEvent, ReactNode } from 'react'

interface SmudgeRevealProps {
  label: string
  children: ReactNode
  revealed: ReactNode
  className?: string
}

interface Stamp {
  circle: SVGCircleElement
  radius: number
  start: number
  delay: number
}

const svgNamespace = 'http://www.w3.org/2000/svg'
const getPadding = () => window.innerWidth < 768 ? 112 : 144

export function SmudgeReveal({ label, children, revealed, className = '' }: SmudgeRevealProps) {
  const id = useId().replaceAll(':', '')
  const maskId = `smudge-mask-${id}`
  const filterId = `smudge-goo-${id}`
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const groupRef = useRef<SVGGElement>(null)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
  const active = useRef<Stamp[]>([])
  const drying = useRef<Stamp[]>([])
  const leaveTimer = useRef(0)
  const animationFrame = useRef(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const svg = svgRef.current
    const group = groupRef.current
    if (!root || !svg || !group) return

    const resize = () => {
      const { width, height } = root.getBoundingClientRect()
      const pad = getPadding()
      svg.setAttribute('viewBox', `0 0 ${Math.max(1, width + 2 * pad)} ${Math.max(1, height + 2 * pad)}`)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(root)
    window.addEventListener('resize', resize)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.clearTimeout(leaveTimer.current)
      window.cancelAnimationFrame(animationFrame.current)
      group.replaceChildren()
    }
  }, [])

  const animateDrying = () => {
    if (animationFrame.current) return
    const tick = (now: number) => {
      drying.current = drying.current.filter(({ circle, radius, start, delay }) => {
        const progress = Math.min(1, Math.max(0, (now - start - delay) / 1500))
        const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(2 - 2 * progress, 2) / 2
        circle.setAttribute('r', String(Math.max(0, radius * (1 - eased))))
        if (progress < 1) return true
        circle.remove()
        return false
      })
      animationFrame.current = drying.current.length ? window.requestAnimationFrame(tick) : 0
    }
    animationFrame.current = window.requestAnimationFrame(tick)
  }

  const addStamp = (x: number, y: number) => {
    const group = groupRef.current
    if (!group) return
    const circle = document.createElementNS(svgNamespace, 'circle')
    circle.setAttribute('cx', String(x))
    circle.setAttribute('cy', String(y))
    circle.setAttribute('r', '38')
    circle.setAttribute('fill', 'white')
    group.appendChild(circle)
    active.current.push({ circle, radius: 38, start: 0, delay: 0 })

  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || (event.pointerType !== 'mouse' && event.pointerType !== 'touch')) return
    window.clearTimeout(leaveTimer.current)

    const bounds = rootRef.current?.getBoundingClientRect()
    if (!bounds) return
    const pad = getPadding()
    const point = { x: event.clientX - bounds.left + pad, y: event.clientY - bounds.top + pad }
    const previous = lastPoint.current
    if (previous) {
      const dx = point.x - previous.x
      const dy = point.y - previous.y
      if (Math.hypot(dx, dy) < 4) return
      const count = Math.floor(Math.hypot(dx, dy) / 12)
      for (let index = 1; index <= count; index += 1) {
        const fraction = index / (count + 1)
        addStamp(previous.x + dx * fraction, previous.y + dy * fraction)
      }
    }
    addStamp(point.x, point.y)
    lastPoint.current = point
  }

  const handlePointerLeave = () => {
    lastPoint.current = null
    window.clearTimeout(leaveTimer.current)
    if (!active.current.length || reduceMotion) return

    leaveTimer.current = window.setTimeout(() => {
      const now = performance.now()
      drying.current.push(...active.current.splice(0).map((stamp, index) => ({
        ...stamp,
        start: now,
        delay: (index % 12) * 20,
      })))
      animateDrying()
    }, 300)
  }

  return (
    <div
      aria-label={label}
      className={`smudge-reveal ${className}`.trim()}
      onPointerCancel={handlePointerLeave}
      onPointerDown={(event) => { if (event.pointerType === 'touch') handlePointerMove(event) }}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') handlePointerMove(event) }}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => { if (event.pointerType === 'touch') handlePointerLeave() }}
      ref={rootRef}
      role="group"
    >
      <div className="smudge-reveal-base">{children}</div>
      <div aria-hidden="true" className="smudge-reveal-ink" style={{ mask: `url(#${maskId})`, WebkitMask: `url(#${maskId})` }}>
        {revealed}
      </div>
      <svg aria-hidden="true" className="smudge-reveal-svg" ref={svgRef}>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -14" />
          </filter>
          <mask id={maskId} maskContentUnits="userSpaceOnUse" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect fill="black" height="100%" width="100%" />
            <g filter={`url(#${filterId})`} ref={groupRef} />
          </mask>
        </defs>
      </svg>
    </div>
  )
}
