import { useReducedMotion } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
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
  const touchHideTimer = useRef(0)
  const touchPointer = useRef<number | null>(null)
  const animationFrame = useRef(0)
  const reduceMotion = useReducedMotion()
  const [touchMode, setTouchMode] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => setTouchMode(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

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
      window.clearTimeout(touchHideTimer.current)
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

  const addStamp = (x: number, y: number, radius = 38) => {
    const group = groupRef.current
    if (!group) return
    const circle = document.createElementNS(svgNamespace, 'circle')
    circle.setAttribute('cx', String(x))
    circle.setAttribute('cy', String(y))
    circle.setAttribute('r', String(radius))
    circle.setAttribute('fill', 'white')
    group.appendChild(circle)
    active.current.push({ circle, radius, start: 0, delay: 0 })

  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'touch') return

    if (touchMode && event.pointerType === 'touch') {
      if (touchPointer.current !== event.pointerId) return
      const root = rootRef.current
      const bounds = root?.getBoundingClientRect()
      if (!root || !bounds) return
      root.style.setProperty('--smudge-touch-x', `${event.clientX - bounds.left}px`)
      root.style.setProperty('--smudge-touch-y', `${event.clientY - bounds.top}px`)
      root.dataset.touchActive = 'true'
      return
    }

    if (reduceMotion) return
    window.clearTimeout(leaveTimer.current)

    const bounds = rootRef.current?.getBoundingClientRect()
    if (!bounds) return
    const pad = getPadding()
    const point = { x: event.clientX - bounds.left + pad, y: event.clientY - bounds.top + pad }
    const radius = event.pointerType === 'touch' ? 58 : 38
    const previous = lastPoint.current
    if (previous) {
      const dx = point.x - previous.x
      const dy = point.y - previous.y
      if (Math.hypot(dx, dy) < 4) return
      const count = Math.floor(Math.hypot(dx, dy) / 12)
      for (let index = 1; index <= count; index += 1) {
        const fraction = index / (count + 1)
        addStamp(previous.x + dx * fraction, previous.y + dy * fraction, radius)
      }
    }
    addStamp(point.x, point.y, radius)
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

  const beginTouchReveal = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') return
    touchPointer.current = event.pointerId
    window.clearTimeout(touchHideTimer.current)
    event.currentTarget.setPointerCapture(event.pointerId)
    handlePointerMove(event)
  }

  const finishTouchReveal = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch') return
    if (touchPointer.current === event.pointerId) touchPointer.current = null

    if (!touchMode) {
      handlePointerLeave()
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    window.clearTimeout(touchHideTimer.current)
    touchHideTimer.current = window.setTimeout(() => {
      if (rootRef.current) rootRef.current.dataset.touchActive = 'false'
    }, 700)
  }

  const desktopMask = `url(#${maskId})`
  const touchMask = 'radial-gradient(ellipse 7.4rem 5.2rem at calc(var(--smudge-touch-x, 50%) + 0.75rem) calc(var(--smudge-touch-y, 50%) + 0.75rem), #000 0%, #000 48%, rgb(0 0 0 / 0.92) 60%, transparent 100%)'

  return (
    <div
      aria-label={label}
      className={`smudge-reveal ${className}`.trim()}
      data-touch-active="false"
      data-touch-mode={touchMode ? 'true' : 'false'}
      onPointerCancel={finishTouchReveal}
      onPointerDown={beginTouchReveal}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') handlePointerMove(event) }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') handlePointerLeave() }}
      onPointerMove={handlePointerMove}
      onPointerUp={finishTouchReveal}
      ref={rootRef}
      role="group"
    >
      <div className="smudge-reveal-base">{children}</div>
      <div aria-hidden="true" className="smudge-reveal-ink" style={{ mask: touchMode ? touchMask : desktopMask, WebkitMask: touchMode ? touchMask : desktopMask }}>
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
