import { useState } from 'react'
import './Sidebar.css'
import type { Tool } from '../types/tools'

interface SidebarProps {
  activeTool: Tool
  onToolSelect: (tool: Tool) => void
}

function Sidebar({ activeTool, onToolSelect }: SidebarProps) {
  const [baseEncodingExpanded, setBaseEncodingExpanded] = useState(false);

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: "json-data-generator", name: "JSON Data Generator", icon: "⚙" },
    { id: "json-beautifier", name: "JSON Beautifier", icon: "{ }" },
    { id: "diff-checker", name: "Difference Checker", icon: "⇄" },
    { id: "id-password-generator", name: "Password Generator", icon: "#" },
    { id: "json-schema-validator", name: "JSON Schema Validator", icon: "◇" },
    { id: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", icon: "📝" },
    { id: "hashing-tool", name: "Hash Generator", icon: "◉" },
    { id: "aes-encryption-tool", name: "AES Encryption", icon: "◆" },
    { id: "rsa-encryption-tool", name: "RSA Encryption", icon: "◇" },
    { id: "regex-matcher", name: "Regex Matcher", icon: "🔍" },
    { id: "jwt-decoder", name: "JWT Token Encoder and Decoder", icon: "🔐" },
    { id: "qr-generator", name: "QR Generator", icon: "📱" },
    { id: "cli-command-breaks", name: "CLI Command Line Breaks", icon: "⌨️" },
    { id: "color-picker", name: "Color Picker", icon: "🎨" },
    { id: "ulid-uuid-generator", name: "UUID Generator", icon: "⚡" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>DevTools Hub</h2>
      </div>

      <nav className="sidebar-nav">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`nav-item ${activeTool === tool.id ? "active" : ""}`}
            onClick={() => onToolSelect(tool.id)}
          >
            <span className="nav-icon">{tool.icon}</span>
            <span className="nav-text">{tool.name}</span>
          </button>
        ))}

        {/* Base Encoding Dropdown */}
        <div className="nav-dropdown">
          <button
            className={`nav-item nav-dropdown-toggle ${activeTool === "base-encoding" ? "active" : ""}`}
            onClick={() => {
              onToolSelect("base-encoding");
              setBaseEncodingExpanded((prev) => !prev);
            }}
          >
            <span className="nav-icon">⇅</span>
            <span className="nav-text">Base Encoding</span>
            <span className={`nav-arrow ${baseEncodingExpanded ? "expanded" : ""}`}>▼</span>
          </button>
          {baseEncodingExpanded && (
            <div className="nav-dropdown-menu">
              <button
                className="nav-dropdown-item"
                onClick={() => {
                  onToolSelect("base32-encode");
                }}
              >
                Base32
              </button>
              <button
                className="nav-dropdown-item"
                onClick={() => {
                  onToolSelect("base64-encode");
                }}
              >
                Base64
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
