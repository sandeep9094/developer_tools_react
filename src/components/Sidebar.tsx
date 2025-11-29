import { useState, useEffect } from 'react'
import './Sidebar.css'
import type { Tool, BaseEncodingMode } from '../types/tools'

interface SidebarProps {
  activeTool: Tool
  onToolSelect: (tool: Tool) => void
}

function Sidebar({ activeTool, onToolSelect }: SidebarProps) {
  const isBaseEncodingActive = 
    activeTool === "base32-encode" || 
    activeTool === "base32-decode" || 
    activeTool === "base64-encode" || 
    activeTool === "base64-decode";
  
  const [baseEncodingExpanded, setBaseEncodingExpanded] = useState(isBaseEncodingActive);
  
  // Auto-expand when a base encoding tool becomes active
  useEffect(() => {
    if (isBaseEncodingActive) {
      setBaseEncodingExpanded(true);
    }
  }, [isBaseEncodingActive]);

  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: "json-data-generator", name: "JSON Data Generator", icon: "⚙" },
    { id: "json-beautifier", name: "JSON Beautifier", icon: "{ }" },
    { id: "diff-checker", name: "Difference Checker", icon: "⇄" },
    { id: "id-password-generator", name: "Password Generator", icon: "#" },
    { id: "json-schema-validator", name: "JSON Schema Validator", icon: "◇" },
    { id: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", icon: "📝" },
    { id: "hashing-tool", name: "Hash Generator", icon: "◉" },
    { id: "regex-matcher", name: "Regex Matcher", icon: "🔍" },
    { id: "jwt-decoder", name: "JWT Token Encoder and Decoder", icon: "🔐" },
    { id: "qr-generator", name: "QR Generator", icon: "📱" },
    { id: "cli-command-breaks", name: "CLI Command Line Breaks", icon: "⌨️" },
    { id: "color-picker", name: "Color Picker", icon: "🎨" },
    { id: "ulid-uuid-generator", name: "UUID Generator", icon: "⚡" },
  ];

  const baseEncodingOptions: { id: BaseEncodingMode; name: string }[] = [
    { id: "base32-encode", name: "Base32 Encode" },
    { id: "base32-decode", name: "Base32 Decode" },
    { id: "base64-encode", name: "Base64 Encode" },
    { id: "base64-decode", name: "Base64 Decode" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>DevTools Hub</h2>
        <p className="sidebar-subtitle">Client-Side Utilities</p>
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
            className={`nav-item nav-dropdown-toggle ${isBaseEncodingActive ? "active" : ""}`}
            onClick={() => setBaseEncodingExpanded(!baseEncodingExpanded)}
          >
            <span className="nav-icon">⇅</span>
            <span className="nav-text">Base Encoding</span>
            <span className={`nav-arrow ${baseEncodingExpanded ? "expanded" : ""}`}>▼</span>
          </button>
          {baseEncodingExpanded && (
            <div className="nav-dropdown-menu">
              {baseEncodingOptions.map((option) => (
                <button
                  key={option.id}
                  className={`nav-dropdown-item ${activeTool === option.id ? "active" : ""}`}
                  onClick={() => {
                    onToolSelect(option.id);
                    setBaseEncodingExpanded(false);
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
