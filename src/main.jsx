import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ModeContextProvider } from './context/ModeContext.jsx'

createRoot(document.getElementById('root')).render(
    <ModeContextProvider>
      <App />
    </ModeContextProvider>
  // <StrictMode>
  //   <App />
  // </StrictMode>,
)
