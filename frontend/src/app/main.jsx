import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainPage from './main-page.jsx'
import "./globals.css"

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MainPage />
    </StrictMode>,
)
