import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Base32Encoding from './components/Base32Encoding'
import './App.css'

type Tool = 'base32-encode' | 'base32-decode'

function App() {
  const [activeTool, setActiveTool] = useState<Tool>('base32-encode')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDarkMode(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const mode = activeTool === 'base32-encode' ? 'encode' : 'decode'

  return (
    <div className="app-layout">
      <Sidebar activeTool={activeTool} onToolSelect={setActiveTool} />
      <div className="main-content">
        <div className="top-bar">
          <h1>Developer Productivity Tools</h1>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <Base32Encoding mode={mode} />
      </div>
    </div>
  )
}

export default App
