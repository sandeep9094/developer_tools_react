import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Footer from './components/Footer'
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

  const renderTool = () => {
    switch (activeTool) {
      case 'base32-encode':
        return <Base32Encoding mode="encode" />
      case 'base32-decode':
        return <Base32Encoding mode="decode" />
      default:
        return (
          <div className="main-content-placeholder">
            <h2>Select a tool from the sidebar</h2>
            <p>Choose a tool to get started</p>
          </div>
        )
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activeTool={activeTool} onToolSelect={setActiveTool} />
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <main className="main-content">
        <div className="tool-container">
          {renderTool()}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
