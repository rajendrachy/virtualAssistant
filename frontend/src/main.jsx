import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// ✅ MUST match actual file name EXACTLY
import UserContext from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserContext>
        <App />
      </UserContext>
    </BrowserRouter>
  </StrictMode>
)

