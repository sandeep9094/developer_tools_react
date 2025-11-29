import './Header.css'

interface HeaderProps {
  isDarkMode: boolean
  onToggleTheme: () => void
}

function Header({ isDarkMode, onToggleTheme }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Developer Productivity Tools</h1>
        <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme">
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}

export default Header