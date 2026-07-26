import { lazy, Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useInView } from '../../hooks/useInView'
import { SceneErrorBoundary } from './SceneErrorBoundary'
import { ThoughtBubbles } from '../ui/ThoughtBubbles'
import type { Locale, WorkspaceMode } from '../../types/content'

const PortfolioCanvas = lazy(() =>
  import('./PortfolioCanvas').then((module) => ({
    default: module.PortfolioCanvas,
  })),
)

interface PortfolioScenePlaceholderProps {
  label: string
  locale: Locale
  mode: WorkspaceMode
  onModeChange: (mode: WorkspaceMode) => void
}

export function PortfolioScenePlaceholder({
  label,
  locale,
  mode,
  onModeChange,
}: PortfolioScenePlaceholderProps) {
  const { ref, hasEntered } = useInView<HTMLDivElement>()
  const [canLoadScene, setCanLoadScene] = useState(
    () => !window.matchMedia('(max-width: 40rem)').matches,
  )

  useEffect(() => {
    if (canLoadScene) return

    let idleId: number | undefined
    let timerId: ReturnType<typeof globalThis.setTimeout> | undefined

    const loadScene = () => {
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(
          () => setCanLoadScene(true),
          { timeout: 1200 },
        )
        return
      }

      timerId = globalThis.setTimeout(() => setCanLoadScene(true), 250)
    }

    if (document.readyState === 'complete') {
      loadScene()
    } else {
      window.addEventListener('load', loadScene, { once: true })
    }

    return () => {
      window.removeEventListener('load', loadScene)
      if (idleId !== undefined) window.cancelIdleCallback(idleId)
      if (timerId !== undefined) globalThis.clearTimeout(timerId)
    }
  }, [canLoadScene])

  const moveScene = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || !ref.current) return
    const bounds = ref.current.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    ref.current.style.setProperty('--scene-rotate-x', `${y * -1.4}deg`)
    ref.current.style.setProperty('--scene-rotate-y', `${x * 1.8}deg`)
  }
  const resetScene = () => {
    ref.current?.style.setProperty('--scene-rotate-x', '0deg')
    ref.current?.style.setProperty('--scene-rotate-y', '0deg')
  }

  const fallback = <SceneFallback label={label} />

  return (
    <div
      aria-label={label}
      className={`scene-frame scene-mode-${mode} relative flex aspect-[4/5] min-h-80 items-center justify-center overflow-hidden rounded-[2rem] border border-line bg-surface`}
      onPointerLeave={resetScene}
      onPointerMove={moveScene}
      ref={ref}
      role="img"
    >
      <div className="scene-grid absolute inset-0" />
      {hasEntered && canLoadScene ? (
        <SceneErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <PortfolioCanvas mode={mode} />
          </Suspense>
        </SceneErrorBoundary>
      ) : (
        fallback
      )}
      <ThoughtBubbles
        activeMode={mode}
        locale={locale}
        onModeChange={onModeChange}
      />
      <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center justify-between rounded-full border border-white/10 bg-canvas/70 px-4 py-2 text-[0.65rem] uppercase tracking-[0.16em] text-muted backdrop-blur">
        <span>Data → Software</span>
        <span className="text-accent">
          {mode === 'data'
            ? 'Data mode'
            : mode === 'automation'
              ? 'Automation'
              : 'Software mode'}
        </span>
      </div>
    </div>
  )
}

function SceneFallback({ label }: { label: string }) {
  return (
    <div className="scene-loading-state">
      <div aria-hidden="true" className="scene-loading-core">
        <span />
        <span />
        <span />
      </div>
      <p>Loading 3D workspace</p>
      <span className="sr-only">{label}</span>
    </div>
  )
}
