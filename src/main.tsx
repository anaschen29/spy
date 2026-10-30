import React from 'react'
import ReactDOM from 'react-dom/client'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import { CssBaseline } from '@mui/material'
import GameTheme from './GameTheme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GameTheme>
      <CssBaseline />
      <App />
      <SpeedInsights />
      <Analytics />
    </GameTheme>
  </React.StrictMode>,
)
