import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Developer Productivity Tools. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

