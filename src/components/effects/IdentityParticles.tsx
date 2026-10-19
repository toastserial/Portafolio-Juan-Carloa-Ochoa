import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Locale } from '../../types/content'

const vertexSource = `
attribute vec2 aPosition;
attribute float aTint;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uPointSize;
varying float vTint;
void main() {
  vec2 clip = aPosition / uResolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = uPointSize * uPixelRatio;
  vTint = aTint;
}`

const fragmentSource = `
precision mediump float;
varying float vTint;
void main() {
  float distanceToCenter = length(gl_PointCoord - 0.5);
  float alpha = 1.0 - smoothstep(0.0, 0.4, distanceToCenter);
  vec3 paper = vec3(0.99, 0.98, 0.95);
  vec3 lilac = vec3(0.85, 0.73, 0.98);
  gl_FragColor = vec4(mix(paper, lilac, vTint), alpha);
}`

function makeShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  gl.deleteShader(shader)
  return null
}

const identityLinesByLocale = {
  es: ['CREANDO', 'SOFTWARE', 'ÚTIL'],
  en: ['BUILDING', 'USEFUL', 'SOFTWARE'],
}

export function IdentityParticles({ locale }: { locale: Locale }) {
  const identityLines = identityLinesByLocale[locale]
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeTouchPointer = useRef<number | null>(null)
  const [ready, setReady] = useState(false)

  const updateTouchFallback = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType !== 'touch') return
    const stage = stageRef.current
    if (!stage) return
    const bounds = stage.getBoundingClientRect()
    const x = Math.max(-18, Math.min(18, (event.clientX - bounds.left - bounds.width / 2) * 0.045))
    const y = Math.max(-14, Math.min(14, (event.clientY - bounds.top - bounds.height / 2) * 0.045))
    stage.style.setProperty('--identity-touch-x', `${x}px`)
    stage.style.setProperty('--identity-touch-y', `${y}px`)
    stage.dataset.touchActive = 'true'
  }

  const resetTouchFallback = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType !== 'touch') return
    activeTouchPointer.current = null
    const stage = stageRef.current
    stage?.style.setProperty('--identity-touch-x', '0px')
    stage?.style.setProperty('--identity-touch-y', '0px')
    if (stage) stage.dataset.touchActive = 'false'
  }

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return
    setReady(false)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = navigator as Navigator & { connection?: { saveData?: boolean } }
    if (reducedMotion.matches || connection.connection?.saveData || (navigator.hardwareConcurrency ?? 4) < 4) return

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    })
    if (!gl) return

    const vertex = makeShader(gl, gl.VERTEX_SHADER, vertexSource)
    const fragment = makeShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex)
      if (fragment) gl.deleteShader(fragment)
      return
    }

    const program = gl.createProgram()
    const positionBuffer = gl.createBuffer()
    const tintBuffer = gl.createBuffer()
    if (!program || !positionBuffer || !tintBuffer) {
      if (program) gl.deleteProgram(program)
      if (positionBuffer) gl.deleteBuffer(positionBuffer)
      if (tintBuffer) gl.deleteBuffer(tintBuffer)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      return
    }
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(tintBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      return
    }

    const positionLocation = gl.getAttribLocation(program, 'aPosition')
    const tintLocation = gl.getAttribLocation(program, 'aTint')
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution')
    const pixelRatioLocation = gl.getUniformLocation(program, 'uPixelRatio')
    const pointSizeLocation = gl.getUniformLocation(program, 'uPointSize')
    let positions = new Float32Array(0)
    let origins = new Float32Array(0)
    let velocities = new Float32Array(0)
    let count = 0
    let frame = 0
    let framesLeft = 0
    let visible = true
    let lastFrame = 0
    let disposed = false
    let contextLost = false
    let pointSize = 3.5
    const pointer = { x: -10000, y: -10000 }

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.uniform2f(resolutionLocation, canvas.clientWidth, canvas.clientHeight)
      gl.uniform1f(pixelRatioLocation, canvas.width / Math.max(canvas.clientWidth, 1))
      gl.uniform1f(pointSizeLocation, pointSize)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, tintBuffer)
      gl.enableVertexAttribArray(tintLocation)
      gl.vertexAttribPointer(tintLocation, 1, gl.FLOAT, false, 0, 0)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.drawArrays(gl.POINTS, 0, count)
    }

    const tick = (now: number) => {
      frame = 0
      if (disposed || contextLost || !visible || document.hidden) return
      const frameInterval = window.innerWidth < 768 ? 1000 / 40 : 1000 / 60
      if (now - lastFrame < frameInterval) {
        frame = requestAnimationFrame(tick)
        return
      }
      const step = Math.min((now - lastFrame) / 16.67 || 1, 2)
      lastFrame = now
      // Match the reference's broad cursor field: a single pass should move
      // a visible cluster of the word, not just a tiny handful of nearby dots.
      const radius = Math.min(stage.clientWidth * 0.72, 660)
      const radiusSquared = radius * radius
      const damping = Math.pow(0.82, step)
      for (let i = 0; i < count; i++) {
        const offset = i * 2
        const dx = positions[offset] - pointer.x
        const dy = positions[offset + 1] - pointer.y
        const distanceSquared = dx * dx + dy * dy
        if (distanceSquared < radiusSquared && distanceSquared > 1) {
          const distance = Math.sqrt(distanceSquared)
          const proximity = 1 - distance / radius
          const pressure = proximity * 2.8 * step
          const swirl = proximity * 0.3
          const directionX = dx / distance
          const directionY = dy / distance
          velocities[offset] += (directionX - directionY * swirl) * pressure
          velocities[offset + 1] += (directionY + directionX * swirl) * pressure
        }
        velocities[offset] += (origins[offset] - positions[offset]) * 0.04 * step
        velocities[offset + 1] += (origins[offset + 1] - positions[offset + 1]) * 0.04 * step
        velocities[offset] *= damping
        velocities[offset + 1] *= damping
        positions[offset] += velocities[offset] * step
        positions[offset + 1] += velocities[offset + 1] * step
        const originDx = positions[offset] - origins[offset]
        const originDy = positions[offset + 1] - origins[offset + 1]
        const displacementSquared = originDx * originDx + originDy * originDy
        if (displacementSquared > 50 * 50) {
          const scale = 50 / Math.sqrt(displacementSquared)
          positions[offset] = origins[offset] + originDx * scale
          positions[offset + 1] = origins[offset + 1] + originDy * scale
          velocities[offset] *= 0.7
          velocities[offset + 1] *= 0.7
        }
      }
      draw()
      framesLeft -= 1
      if (framesLeft > 0) frame = requestAnimationFrame(tick)
    }

    const wake = () => {
      framesLeft = window.innerWidth < 768 ? 180 : 240
      if (!frame && !contextLost && visible && !document.hidden) frame = requestAnimationFrame(tick)
    }

    const build = () => {
      if (contextLost) return
      const width = Math.round(stage.clientWidth)
      const height = Math.round(stage.clientHeight)
      if (width < 1 || height < 1) return
      const isSmallScreen = window.innerWidth < 768
      const dpr = Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.1 : 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      const mask = document.createElement('canvas')
      mask.width = width
      mask.height = height
      const context = mask.getContext('2d', { willReadFrequently: true })
      if (!context) return
      // Keep the glyphs at the reference's more compact scale instead of
      // letting the three-line Spanish title fill nearly the whole canvas.
      const fontSize = Math.min(width * 0.17, height * 0.24)
      context.fillStyle = '#fff'
      context.font = `900 ${fontSize}px "Bigger Display", Impact, "Arial Narrow", sans-serif`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      identityLines.forEach((line, index) => context.fillText(line, width / 2, height * (0.24 + index * 0.26), width * 0.96))
      const pixels = context.getImageData(0, 0, width, height).data
      const target = width < 500 ? 8500 : 75000
      const minimumStride = width < 500 ? 2 : 1.5
      const stride = Math.max(minimumStride, Math.sqrt(width * height * 0.35 / target))
      pointSize = 3.5
      const points: number[] = []
      const tints: number[] = []
      for (let y = stride; y < height - stride; y += stride) {
        for (let x = stride; x < width - stride; x += stride) {
          const sampleX = Math.floor(x)
          const sampleY = Math.floor(y)
          if (pixels[(sampleY * width + sampleX) * 4 + 3] < 130) continue
          points.push(x, y)
          const isAccentLine = y >= height * 0.375 && y <= height * 0.625
          tints.push(isAccentLine || (sampleX + sampleY * 3) % 53 === 0 ? 1 : 0)
        }
      }
      count = points.length / 2
      if (!count) { setReady(false); return }
      origins = new Float32Array(points)
      positions = new Float32Array(points)
      velocities = new Float32Array(points.length)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, tintBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tints), gl.STATIC_DRAW)
      draw()
      setReady(true)
    }

    const resizeObserver = new ResizeObserver(build)
    resizeObserver.observe(stage)
    void document.fonts.load('900 72px "Bigger Display"').then(() => {
      if (!disposed) build()
    })
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && framesLeft > 0) wake()
      else if (frame) { cancelAnimationFrame(frame); frame = 0 }
    }, { threshold: 0.05 })
    visibilityObserver.observe(stage)
    const movePointer = (event: globalThis.PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      wake()
    }
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== 'touch') return
      activeTouchPointer.current = event.pointerId
      movePointer(event)
    }
    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType === 'touch' && activeTouchPointer.current !== event.pointerId) return
      movePointer(event)
    }
    const onPointerUp = (event: globalThis.PointerEvent) => {
      if (event.pointerType === 'touch' && activeTouchPointer.current === event.pointerId) activeTouchPointer.current = null
    }
    const onPointerLeave = (event: globalThis.PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointer.x = -10000
      pointer.y = -10000
      wake()
    }
    const onVisibility = () => {
      if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0 }
      else if (framesLeft > 0) wake()
    }
    const onContextLost = (event: Event) => { event.preventDefault(); contextLost = true; setReady(false); if (frame) cancelAnimationFrame(frame); frame = 0 }
    stage.addEventListener('pointerdown', onPointerDown)
    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerup', onPointerUp)
    stage.addEventListener('pointercancel', onPointerUp)
    stage.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibility)
    canvas.addEventListener('webglcontextlost', onContextLost)
    build()

    return () => {
      disposed = true
      if (frame) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      stage.removeEventListener('pointerdown', onPointerDown)
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerup', onPointerUp)
      stage.removeEventListener('pointercancel', onPointerUp)
      stage.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(tintBuffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [identityLines])

  return (
    <div aria-label={locale === 'es' ? 'Tipografía interactiva: creando software útil' : 'Interactive typography: building useful software'} className={`identity-artwork${ready ? ' is-ready' : ''}`} ref={stageRef} role="img">
      <span aria-hidden="true" className="identity-static">{identityLines.map((line) => <span key={line}>{line}</span>)}</span>
      <canvas
        aria-hidden="true"
        onPointerCancel={resetTouchFallback}
        onPointerDown={(event) => {
          if (event.pointerType === 'touch') {
            activeTouchPointer.current = event.pointerId
            event.currentTarget.setPointerCapture(event.pointerId)
          }
          updateTouchFallback(event)
        }}
        onPointerMove={updateTouchFallback}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
          resetTouchFallback(event)
        }}
        ref={canvasRef}
      />
    </div>
  )
}
