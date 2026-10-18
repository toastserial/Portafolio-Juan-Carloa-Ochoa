const sounds = new Map<string, HTMLAudioElement>()

function playSound(file: 'click.mp3' | 'hover.mp3', volume: number) {
  if (typeof window === 'undefined') return

  let audio = sounds.get(file)
  if (!audio) {
    audio = new Audio(`/sounds/${file}`)
    audio.preload = 'auto'
    audio.volume = volume
    sounds.set(file, audio)
  }

  audio.currentTime = 0
  void audio.play().catch(() => {
    // Sound is optional; keep navigation working if playback is unavailable.
  })
}

export function playClick() {
  playSound('click.mp3', 0.2)
}

export function playHover() {
  playSound('hover.mp3', 0.13)
}
