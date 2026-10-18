import { useReducedMotion } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'

interface ScrollLyricsTextProps {
  text: string
  className?: string
  initialColor?: string
  accentColor?: string
  finalColor?: string
  start?: number
  end?: number
}

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function ScrollLyricsText({
  text,
  className = '',
  initialColor = '#5b5660',
  accentColor = 'var(--color-accent)',
  finalColor = 'var(--color-ink)',
  start = 0.98,
  end = 0.45,
}: ScrollLyricsTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const chars = Array.from(root.querySelectorAll<HTMLElement>('[data-lyrics-char]'))
    if (reduceMotion) {
      chars.forEach((char) => { char.style.color = finalColor })
      return
    }

    let frame = 0
    let previousIndex = -1
    let wasComplete = false
    const update = () => {
      frame = 0
      const rect = root.getBoundingClientRect()
      const startY = window.innerHeight * start
      const endY = window.innerHeight * end
      const progress = clamp((startY - rect.top) / Math.max(1, startY - endY))
      const activeIndex = Math.floor(progress * chars.length)
      const isComplete = progress >= 0.98
      const firstUpdate = previousIndex < 0
      const stateChangedAtEnd = isComplete !== wasComplete
      const first = firstUpdate || stateChangedAtEnd ? 0 : Math.max(0, Math.min(previousIndex, activeIndex) - 3)
      const last = firstUpdate || stateChangedAtEnd
        ? chars.length - 1
        : Math.min(chars.length - 1, Math.max(previousIndex, activeIndex) + 1)

      for (let index = first; index <= last; index += 1) {
        const char = chars[index]
        if (isComplete || index < activeIndex - 2) {
          char.style.color = finalColor
        } else if (index <= activeIndex) {
          char.style.color = accentColor
        } else {
          char.style.color = initialColor
        }
      }
      previousIndex = activeIndex
      wasComplete = isComplete
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = new ResizeObserver(schedule)
    observer.observe(root)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [accentColor, end, finalColor, initialColor, reduceMotion, start, text])

  const parts = text.trim().split(/(\s+)/u)
  let charIndex = 0

  return (
    <span aria-label={text} className={`scroll-lyrics ${className}`.trim()} ref={rootRef}>
      <span className="scroll-lyrics-accessible">{text}</span>
      <span aria-hidden="true" className="scroll-lyrics-visual">
        {parts.map((part, partIndex) => {
          if (/^\s+$/u.test(part)) return <span key={`space-${partIndex}`}>{part}</span>
          return (
            <span className="scroll-lyrics-word" key={`word-${partIndex}`}>
              {Array.from(part).map((char) => {
                const index = charIndex++
                return <span data-lyrics-char="" key={`${index}-${char}`} style={{ color: initialColor }}>{char}</span>
              })}
            </span>
          )
        })}
      </span>
    </span>
  )
}
