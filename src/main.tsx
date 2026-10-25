import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/global.css'

let storedTheme: string | null = null
try { storedTheme = window.localStorage.getItem('portfolio-theme') } catch { /* use dark mode when storage is unavailable */ }
document.documentElement.dataset.theme = storedTheme === 'light' ? 'light' : 'dark'
document.documentElement.style.colorScheme = storedTheme === 'light' ? 'light' : 'dark'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
