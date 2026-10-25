export function getAccentColor(fallback = '#b28ad6') {
  if (typeof document === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || fallback
}

export function hexToRgb(value: string, fallback: [number, number, number] = [0.7, 0.54, 0.84]) {
  const normalized = value.replace('#', '').trim()
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return fallback
  return [
    Number.parseInt(normalized.slice(0, 2), 16) / 255,
    Number.parseInt(normalized.slice(2, 4), 16) / 255,
    Number.parseInt(normalized.slice(4, 6), 16) / 255,
  ] as [number, number, number]
}
