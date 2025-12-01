import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

return (
  <footer className="app-footer">
    <div className="footer-content">
      <p>&copy; {currentYear} Developed by Team Tri Nova - SRK.</p>
      <p>Sandeep Rajat Kanwar</p>
    </div>
  </footer>
)
}

export default Footer

