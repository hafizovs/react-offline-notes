import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import App from '@/app/App'
import { seedNotesIfEmpty } from '@/shared/lib/seed-notes'

import './index.css'

registerSW({ immediate: true })

seedNotesIfEmpty().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
