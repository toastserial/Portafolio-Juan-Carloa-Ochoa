import { useEffect, useRef, useState } from 'react'

const LEFT_LOOK_TIME = 0.25
const CENTER_LOOK_TIME = 1.3
const RIGHT_LOOK_TIME = 2.55
const VIDEO_SRC =
  'https://res.cloudinary.com/jj1s4tar/video/upload/c_crop,g_west,h_1080,w_1660/q_auto:good/v1789532559/Juan-Portofolio.mp4'
const POSTER_SRC = '/images/hero/juan-character-poster.jpg'

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const targetTimeRef = useRef(CENTER_LOOK_TIME)
  const isSeekingRef = useRef(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const queueSeek = (clientX: number) => {
      if (
        reducedMotion.matches ||
        !video.duration ||
        Number.isNaN(video.duration)
      ) {
        return
      }

      const pointerProgress = Math.min(Math.max(clientX / window.innerWidth, 0), 1)
      targetTimeRef.current =
        LEFT_LOOK_TIME + pointerProgress * (RIGHT_LOOK_TIME - LEFT_LOOK_TIME)

      if (!isSeekingRef.current) {
        isSeekingRef.current = true
        video.currentTime = targetTimeRef.current
      }
    }

    const handleMouseMove = (event: MouseEvent) => queueSeek(event.clientX)
    const handleTouchMove = (event: TouchEvent) => {
      const clientX = event.touches[0]?.clientX
      if (clientX !== undefined) queueSeek(clientX)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  const handleSeeked = () => {
    const video = videoRef.current
    if (!video) return

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
      video.currentTime = targetTimeRef.current
      return
    }

    isSeekingRef.current = false
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (!video) return

    targetTimeRef.current = CENTER_LOOK_TIME
    isSeekingRef.current = true
    video.currentTime = CENTER_LOOK_TIME
  }

  return (
    <div aria-hidden="true" className="hero-video-stage">
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
          onLoadedData={() => setIsReady(true)}
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
