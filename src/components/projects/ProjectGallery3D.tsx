import { useReducedMotion } from 'framer-motion'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Locale, Project } from '../../types/content'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`

const fragmentShader = `
precision highp float;
uniform sampler2D uAtlas;
uniform vec2 uResolution;
uniform vec2 uOffset;
uniform vec2 uPointer;
uniform float uZoom;
uniform float uFocus;
uniform float uTextureCount;
uniform float uColumns;
uniform float uRows;
varying vec2 vUv;

vec3 sampleAtlas(float tile, vec2 uv) {
  vec2 tilePosition = vec2(mod(tile, uColumns), floor(tile / uColumns));
  vec2 atlasUv = (tilePosition + uv) / vec2(uColumns, uRows);
  atlasUv.y = 1.0 - (tilePosition.y + 1.0 - uv.y) / uRows;
  return texture2D(uAtlas, atlasUv).rgb;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 screen = vUv - 0.5;
  screen.x *= aspect;

  vec2 lensCenter = uPointer * 0.1;
  vec2 lensVector = screen - lensCenter;
  float radius = dot(lensVector, lensVector);
  vec2 warped = lensVector * (1.0 + 0.08 * radius) + lensCenter;

  // One landscape preview at a time, with the next real screenshot peeking in.
  float cardWidth = min(1.528, aspect * 0.92);
  vec2 cellSize = vec2(cardWidth, cardWidth * 0.5625);
  vec2 grid = warped * uZoom / cellSize + vec2(uTextureCount * 0.5 + uOffset.x, 0.5);
  vec2 cell = floor(grid);
  vec2 local = fract(grid);
  float isGalleryTile = step(0.0, cell.x) * step(cell.x, uTextureCount - 1.0) * (1.0 - step(0.5, abs(cell.y)));
  float isFocused = 1.0 - step(0.1, abs(cell.x - uFocus));

  vec2 inset = vec2(0.012, 0.018);
  vec2 imageUv = (local - inset) / (vec2(1.0) - 2.0 * inset);
  float inImage = step(0.0, imageUv.x) * step(imageUv.x, 1.0) * step(0.0, imageUv.y) * step(imageUv.y, 1.0);

  vec3 background = vec3(0.055, 0.052, 0.058);
  vec3 image = sampleAtlas(clamp(cell.x, 0.0, uTextureCount - 1.0), imageUv);
  float edge = min(min(local.x, 1.0 - local.x), min(local.y, 1.0 - local.y));
  float card = smoothstep(0.008, 0.018, edge) * inImage * isGalleryTile;
  float focusEdge = (1.0 - smoothstep(0.0, 0.009, edge)) * isFocused * isGalleryTile;
  vec3 color = mix(background, image, card);
  color = mix(color, vec3(0.698, 0.54, 0.84), focusEdge * 0.82);
  float vignette = 1.0 - smoothstep(0.75, 1.45, length(screen) * 1.1);
  gl_FragColor = vec4(color * mix(0.94, 1.0, vignette), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

interface ProjectGallery3DProps {
  activeIndex: number
  fallback: ReactNode
  locale: Locale
  onSelectProject: (index: number) => void
  projects: Project[]
}

export function ProjectGallery3D({ activeIndex, fallback, locale, onSelectProject, projects }: ProjectGallery3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const activeIndexRef = useRef(activeIndex)
  const onSelectProjectRef = useRef(onSelectProject)
  const renderRef = useRef<() => void>(() => undefined)
  const cleanupRef = useRef<() => void>(() => undefined)
  const [ready, setReady] = useState(false)
  const reduceMotion = useReducedMotion()
  onSelectProjectRef.current = onSelectProject

  useEffect(() => {
    activeIndexRef.current = activeIndex
    const material = materialRef.current
    if (!material) return
    material.uniforms.uFocus.value = activeIndex
    renderRef.current()
  }, [activeIndex])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas || projects.length === 0) return
    setReady(false)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: true,
        powerPreference: 'low-power',
      })
    } catch {
      return
    }

    const columns = Math.ceil(Math.sqrt(projects.length))
    const rows = Math.ceil(projects.length / columns)
    const tileWidth = 1280
    const tileHeight = 720
    const atlasCanvas = document.createElement('canvas')
    atlasCanvas.width = columns * tileWidth
    atlasCanvas.height = rows * tileHeight
    const context = atlasCanvas.getContext('2d')
    if (!context) { renderer.dispose(); return }

    let disposed = false
    let frame = 0
    let visible = true
    let dragging = false
    let pointerActive = false
    let dragMoved = false
    let pointerDownX = 0
    let pointerDownY = 0
    let lastX = 0
    const initialOffset = 0.5 - projects.length * 0.5
    const target = { x: initialOffset, zoom: 1 }
    const current = { x: initialOffset, zoom: 1 }
    const pointer = new THREE.Vector2(0, 0)
    let material: THREE.ShaderMaterial | undefined
    let geometry: THREE.PlaneGeometry | undefined
    let texture: THREE.CanvasTexture | undefined

    const loadAtlas = async () => {
      const images = await Promise.all(projects.map((project) => new Promise<HTMLImageElement | null>((resolve) => {
        if (!project.image) { resolve(null); return }
        const image = new Image()
        image.decoding = 'async'
        image.onload = () => resolve(image)
        image.onerror = () => resolve(null)
        image.src = project.image
      })))
      if (disposed) return

      images.forEach((image, index) => {
        if (!image) return
        const x = (index % columns) * tileWidth
        const y = Math.floor(index / columns) * tileHeight
        const scale = Math.max(tileWidth / image.naturalWidth, tileHeight / image.naturalHeight)
        const width = image.naturalWidth * scale
        const height = image.naturalHeight * scale
        context.drawImage(image, x + (tileWidth - width) / 2, y + (tileHeight - height) / 2, width, height)
      })

      texture = new THREE.CanvasTexture(atlasCanvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      material = new THREE.ShaderMaterial({
        uniforms: {
          uAtlas: { value: texture },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uOffset: { value: new THREE.Vector2(initialOffset, 0) },
          uPointer: { value: pointer },
          uZoom: { value: 1 },
          uFocus: { value: activeIndexRef.current },
          uTextureCount: { value: projects.length },
          uColumns: { value: columns },
          uRows: { value: rows },
        },
        vertexShader,
        fragmentShader,
      })
      materialRef.current = material
      geometry = new THREE.PlaneGeometry(2, 2)
      const scene = new THREE.Scene()
      scene.add(new THREE.Mesh(geometry, material))
      const camera = new THREE.Camera()

      const render = () => renderer.render(scene, camera)
      renderRef.current = render
      const resize = () => {
        const width = Math.max(1, wrap.clientWidth)
        const height = Math.max(1, wrap.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
        renderer.setSize(width, height, false)
        material?.uniforms.uResolution.value.set(width, height)
        render()
      }
      const tick = () => {
        frame = 0
        if (disposed || !visible || document.hidden || !material) return
        if (reduceMotion) {
          current.x = target.x
          current.zoom = target.zoom
        } else {
          current.x += (target.x - current.x) * 0.14
          current.zoom += (target.zoom - current.zoom) * 0.14
        }
        material.uniforms.uOffset.value.set(current.x, 0)
        material.uniforms.uZoom.value = current.zoom
        render()
        if (!reduceMotion && (Math.abs(target.x - current.x) > 0.001 || Math.abs(target.zoom - current.zoom) > 0.001)) {
          frame = window.requestAnimationFrame(tick)
        }
      }
      const wake = () => {
        if (!frame && visible && !document.hidden) frame = window.requestAnimationFrame(tick)
      }
      const cardWidthFor = (bounds: DOMRect) => Math.min(1.528, (bounds.width / Math.max(bounds.height, 1)) * 0.92)
      const clampTrack = (value: number) => THREE.MathUtils.clamp(value, initialOffset, projects.length - 0.5 - projects.length * 0.5)
      const onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0) return
        dragging = true
        pointerActive = true
        dragMoved = false
        pointerDownX = event.clientX
        pointerDownY = event.clientY
        lastX = event.clientX
        canvas.setPointerCapture(event.pointerId)
      }
      const onPointerMove = (event: PointerEvent) => {
        const bounds = wrap.getBoundingClientRect()
        pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, 1 - (event.clientY - bounds.top) / bounds.height * 2)
        if (dragging) {
          if (Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY) > 7) dragMoved = true
          target.x = clampTrack(target.x - (event.clientX - lastX) / Math.max(bounds.height, 1) * target.zoom / cardWidthFor(bounds))
          lastX = event.clientX
          wake()
        } else render()
      }
      const onPointerUp = (event: PointerEvent) => {
        if (!pointerActive) return
        pointerActive = false
        dragging = false
        if (dragMoved) return

        const bounds = wrap.getBoundingClientRect()
        const u = (event.clientX - bounds.left) / Math.max(bounds.width, 1)
        const v = (event.clientY - bounds.top) / Math.max(bounds.height, 1)
        const aspect = bounds.width / Math.max(bounds.height, 1)
        const pointerX = u * 2 - 1
        const pointerY = 1 - v * 2
        const screenX = (u - 0.5) * aspect
        const screenY = 0.5 - v
        const lensX = pointerX * 0.1
        const lensY = pointerY * 0.1
        const lensDistance = (screenX - lensX) ** 2 + (screenY - lensY) ** 2
        const warpedX = (screenX - lensX) * (1 + 0.08 * lensDistance) + lensX
        const warpedY = (screenY - lensY) * (1 + 0.08 * lensDistance) + lensY
        const cellWidth = cardWidthFor(bounds)
        const cellHeight = cellWidth * 0.5625
        const gridX = warpedX * current.zoom / cellWidth + projects.length * 0.5 + current.x
        const gridY = warpedY * current.zoom / cellHeight + 0.5
        const cellX = Math.floor(gridX)
        const cellY = Math.floor(gridY)
        const localX = gridX - cellX
        const localY = gridY - cellY
        if (cellY !== 0 || cellX < 0 || cellX >= projects.length || localX < 0.012 || localX > 0.988 || localY < 0.018 || localY > 0.982) return

        const zoomed = current.zoom > 1.06
        target.x = clampTrack(cellX + 0.5 - projects.length * 0.5)
        target.zoom = zoomed ? 1 : 1.12
        activeIndexRef.current = cellX
        if (material) material.uniforms.uFocus.value = cellX
        onSelectProjectRef.current(cellX)
        wake()
      }
      const onPointerCancel = () => {
        pointerActive = false
        dragging = false
      }
      const onPointerLeave = () => { if (!dragging) { pointer.set(0, 0); render() } }
      const onVisibility = () => {
        if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0 }
        else wake()
      }

      wrap.addEventListener('pointerdown', onPointerDown)
      wrap.addEventListener('pointermove', onPointerMove)
      wrap.addEventListener('pointerup', onPointerUp)
      wrap.addEventListener('pointercancel', onPointerCancel)
      wrap.addEventListener('pointerleave', onPointerLeave)
      document.addEventListener('visibilitychange', onVisibility)
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(wrap)
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) wake()
        else if (frame) { cancelAnimationFrame(frame); frame = 0 }
      }, { threshold: 0.02 })
      visibilityObserver.observe(wrap)
      resize()
      setReady(true)

      const cleanScene = () => {
        resizeObserver.disconnect()
        visibilityObserver.disconnect()
        wrap.removeEventListener('pointerdown', onPointerDown)
        wrap.removeEventListener('pointermove', onPointerMove)
        wrap.removeEventListener('pointerup', onPointerUp)
        wrap.removeEventListener('pointercancel', onPointerCancel)
        wrap.removeEventListener('pointerleave', onPointerLeave)
        document.removeEventListener('visibilitychange', onVisibility)
      }
      cleanupRef.current = cleanScene
    }

    void loadAtlas()

    return () => {
      disposed = true
      if (frame) cancelAnimationFrame(frame)
      cleanupRef.current()
      cleanupRef.current = () => undefined
      renderRef.current = () => undefined
      materialRef.current = null
      material?.dispose()
      geometry?.dispose()
      texture?.dispose()
      renderer.dispose()
    }
  }, [projects, reduceMotion])

  return (
    <div className={`project-gallery3d${ready ? ' is-ready' : ''}`}>
      <div className="project-gallery3d-stage" ref={wrapRef}>
        <div aria-hidden="true" className="project-gallery3d-fallback">{fallback}</div>
        <canvas aria-label={locale === 'es' ? 'Previsualizaciones del proyecto; arrastra horizontalmente para explorar' : 'Project previews; drag horizontally to explore'} className="project-gallery3d-canvas" ref={canvasRef} role="img" />
      </div>
      <p className="project-gallery3d-hint">{locale === 'es' ? '( ARRASTRA PARA EXPLORAR )' : '( DRAG TO EXPLORE )'}</p>
    </div>
  )
}
