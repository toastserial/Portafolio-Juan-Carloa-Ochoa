import { useEffect, useRef, useState } from 'react'

const LEFT_LOOK_TIME = 0.25
const CENTER_LOOK_TIME = 1.3
const RIGHT_LOOK_TIME = 2.55
const VIDEO_SRC = '/videos/juan-portfolio-scrub.mp4'
const POSTER_SRC = '/images/hero/juan-character-poster.jpg'
const SEEK_INTERVAL = 1000 / 30
const SEEK_THRESHOLD = 1 / 60
const POINTER_EASING = 9

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const targetTimeRef = useRef(CENTER_LOOK_TIME)
  const isSeekingRef = useRef(false)
  const isVisibleRef = useRef(true)
  const frameRef = useRef(0)
  const lastSeekRef = useRef(0)
  const lastFrameRef = useRef(0)
  const pointerRef = useRef({ x: 0.5, y: 0.46 })
  const smoothPointerRef = useRef({ x: 0.5, y: 0.46 })
  const scheduleRef = useRef<() => void>(() => {})
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const stage = stageRef.current
    if (!video || !stage) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const scheduleSeek = () => {
      if (!frameRef.current) frameRef.current = window.requestAnimationFrame(seekTowardPointer)
    }
    scheduleRef.current = scheduleSeek

    const seekTowardPointer = (now: number) => {
      frameRef.current = 0
      if (!isVisibleRef.current || !Number.isFinite(video.duration)) return

      const elapsed = lastFrameRef.current ? Math.min((now - lastFrameRef.current) / 1000, 0.05) : 1 / 60
      lastFrameRef.current = now
      const pointerEase = 1 - Math.exp(-POINTER_EASING * elapsed)
      const smoothPointer = smoothPointerRef.current
      smoothPointer.x += (pointerRef.current.x - smoothPointer.x) * pointerEase
      smoothPointer.y += (pointerRef.current.y - smoothPointer.y) * pointerEase

      stage.style.setProperty('--hero-video-shift-x', `${(smoothPointer.x - 0.5) * 18}px`)
      stage.style.setProperty('--hero-video-shift-y', `${(smoothPointer.y - 0.5) * 10}px`)

      const difference = targetTimeRef.current - video.currentTime
      const pointerStillMoving =
        Math.abs(pointerRef.current.x - smoothPointer.x) > 0.001 ||
        Math.abs(pointerRef.current.y - smoothPointer.y) > 0.001

      if (isSeekingRef.current || now - lastSeekRef.current < SEEK_INTERVAL) {
        scheduleSeek()
        return
      }

      if (Math.abs(difference) >= SEEK_THRESHOLD) {
        const timeEase = 1 - Math.exp(-8 * elapsed)
        const nextTime = video.currentTime + difference * Math.max(timeEase, 0.18)
        isSeekingRef.current = true
        lastSeekRef.current = now
        video.currentTime = Math.min(Math.max(nextTime, 0), video.duration - 0.04)
      }

      if (pointerStillMoving || Math.abs(difference) >= SEEK_THRESHOLD) scheduleSeek()
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting
      if (entry.isIntersecting) scheduleSeek()
      else if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = 0
      }
    })
    observer.observe(stage)

    const queueSeek = (clientX: number, clientY: number) => {
      if (
        reducedMotion.matches ||
        !isVisibleRef.current ||
        !video.duration ||
        Number.isNaN(video.duration)
      ) {
        return
      }

      const bounds = stage.getBoundingClientRect()
      const pointerProgress = Math.min(Math.max((clientX - bounds.left) / bounds.width, 0), 1)
      const pointerY = Math.min(Math.max((clientY - bounds.top) / bounds.height, 0), 1)
      pointerRef.current = { x: pointerProgress, y: pointerY }
      targetTimeRef.current = Math.min(
        LEFT_LOOK_TIME + pointerProgress * (RIGHT_LOOK_TIME - LEFT_LOOK_TIME),
        video.duration - 0.04,
      )

      scheduleSeek()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') queueSeek(event.clientX, event.clientY)
    }
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) queueSeek(touch.clientX, touch.clientY)
    }
    const handlePointerLeave = () => {
      pointerRef.current = { x: 0.5, y: 0.46 }
      targetTimeRef.current = Number.isFinite(video.duration)
        ? Math.min(CENTER_LOOK_TIME, video.duration - 0.04)
        : CENTER_LOOK_TIME
      scheduleSeek()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handlePointerLeave)
    return () => {
      observer.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handleTouchMove)
      document.documentElement.removeEventListener('mouseleave', handlePointerLeave)
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
      scheduleRef.current = () => {}
    }
  }, [])

  const handleSeeked = () => {
    isSeekingRef.current = false
    setIsReady(true)
    scheduleRef.current()
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (!video) return

    targetTimeRef.current = Math.min(CENTER_LOOK_TIME, video.duration - 0.04)
    lastFrameRef.current = 0
    isSeekingRef.current = true
    video.currentTime = targetTimeRef.current
  }

  return (
    <div aria-hidden="true" className="hero-video-stage" ref={stageRef}>
      <div className="hero-video-media">
        <img
          alt=""
          className={`hero-video-poster ${isReady ? 'is-hidden' : ''}`}
          decoding="async"
          fetchPriority="high"
          src={POSTER_SRC}
        />
        <video
          className={`hero-video ${isReady ? 'is-ready' : ''}`}
          muted
          onLoadedMetadata={handleLoadedMetadata}
          onSeeked={handleSeeked}
          playsInline
          poster={POSTER_SRC}
          preload="auto"
          ref={videoRef}
          src={VIDEO_SRC}
        />
      </div>
      <div className="hero-video-wash" />
      <div className="hero-video-grain" />
    </div>
  )
}
