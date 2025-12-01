import './MainScreen.css'

interface MainScreenProps {
  onNavigate: (screen: string) => void
}

function MainScreen({ onNavigate }: MainScreenProps) {
  return (
    <div className="main-screen">
      <h1>Developer Tools</h1>
      <div className="tools-grid">
        <button 
          className="tool-button"
          onClick={() => onNavigate('base32')}
        >
          Base32 Encoding
        </button>
      </div>
    </div>
  )
}

export default MainScreen

