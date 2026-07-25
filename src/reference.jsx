import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SkillReference from './pages/SkillReference.jsx'
import { applyFavicon } from './lib/favicon'

// Match the portfolio's favicon so the tab icon stays consistent.
applyFavicon()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SkillReference />
  </StrictMode>,
)
