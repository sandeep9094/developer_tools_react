import './Sidebar.css'
import type { Tool } from '../types/tools'

interface SidebarProps {
  activeTool: Tool
  onToolSelect: (tool: Tool) => void
}

function Sidebar({ activeTool, onToolSelect }: SidebarProps) {
  const tools: { id: Tool; name: string; icon: string }[] = [
    { id: "json-beautifier", name: "JSON Beautifier", icon: "{ }" },
    { id: "base32-encode", name: "Base32 Encoding", icon: "⇧" },
    { id: "base32-decode", name: "Base32 Decoding", icon: "⇩" },
    { id: "base64-encode", name: "Base64 Encoding", icon: "⇧" },
    { id: "base64-decode", name: "Base64 Decoding", icon: "⇩" },
    { id: "diff-checker", name: "Difference Checker", icon: "⇄" },
    { id: "regex-matcher", name: "Regex Matcher", icon: "/" },
    { id: "id-password-generator", name: "ID & Password", icon: "#" },
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
      </nav>
    </div>
  );
}

export default Sidebar;
