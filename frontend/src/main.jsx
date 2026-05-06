import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./style.scss"
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/Navbar.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Navbar/>
    <App />
    <Toaster/>
  </StrictMode>,
)
