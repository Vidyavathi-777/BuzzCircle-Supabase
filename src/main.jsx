import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter as Router } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext.jsx'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <HelmetProvider>
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
