import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Developed by Team Tri Nova - SRK.</p>
      </div>
      <p>Sandeep, Rajat, Kanwar</p>
    </footer>
  )
}

export default Footer

