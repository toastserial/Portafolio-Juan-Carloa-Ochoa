import { useEffect, useRef, useState } from 'react'

const LEFT_LOOK_TIME = 0.25
const CENTER_LOOK_TIME = 1.3
const RIGHT_LOOK_TIME = 2.55
const VIDEO_SRC = '/videos/juan-portfolio-scrub.mp4'
const POSTER_SRC = '/images/hero/juan-character-poster.jpg'

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const targetTimeRef = useRef(CENTER_LOOK_TIME)
  const isSeekingRef = useRef(false)
  const isVisibleRef = useRef(true)
  const frameRef = useRef(0)
  const lastSeekRef = useRef(0)
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
      if (!isVisibleRef.current || isSeekingRef.current || !Number.isFinite(video.duration)) return
      const difference = targetTimeRef.current - video.currentTime
      if (Math.abs(difference) < 1 / 48) return
      if (now - lastSeekRef.current < 33) {
        scheduleSeek()
        return
      }
      const nextTime = video.currentTime + difference * 0.22
      isSeekingRef.current = true
      lastSeekRef.current = now
      video.currentTime = nextTime
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

    const queueSeek = (clientX: number) => {
      if (
        reducedMotion.matches ||
        !isVisibleRef.current ||
        !video.duration ||
        Number.isNaN(video.duration)
      ) {
        return
      }

      const pointerProgress = Math.min(Math.max(clientX / window.innerWidth, 0), 1)
      targetTimeRef.current = Math.min(
        LEFT_LOOK_TIME + pointerProgress * (RIGHT_LOOK_TIME - LEFT_LOOK_TIME),
        video.duration - 0.04,
      )

      scheduleSeek()
    }

    const handleMouseMove = (event: MouseEvent) => queueSeek(event.clientX)
    const handleTouchMove = (event: TouchEvent) => {
      const clientX = event.touches[0]?.clientX
      if (clientX !== undefined) queueSeek(clientX)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
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
