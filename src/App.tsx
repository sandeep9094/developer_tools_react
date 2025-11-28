import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Base32Encoding from "./components/Base32Encoding";
import Base64Encoding from "./components/Base64Encoding";
import JsonBeautifierPage from "./components/JsonBeautifier";
import RegexMatcher from "./components/RegexMatcher";
import IdAndPasswordToolPage from "./components/IdAndPasswordTool";
import type { Tool } from "./types/tools";

import "./App.css";

function App() {
  const [activeTool, setActiveTool] = useState<Tool>("json-beautifier");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage / system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const renderTool = () => {
    switch (activeTool) {
      case "json-beautifier":
        return <JsonBeautifierPage />;

      case "base32-encode":
        return <Base32Encoding mode="encode" />;

      case "base32-decode":
        return <Base32Encoding mode="decode" />;

      case "base64-encode":
        return <Base64Encoding mode="encode" />;

      case "base64-decode":
        return <Base64Encoding mode="decode" />;

      case "regex-matcher":
        return <RegexMatcher />;

      case "id-password-generator":
        return <IdAndPasswordToolPage />;

      default:
        return (
          <div className="main-content-placeholder">
            <h2>Select a tool from the sidebar</h2>
            <p>Choose a tool to get started</p>
          </div>
        );
    }
  };



  return (
    <div className="app-layout">
      <Sidebar activeTool={activeTool} onToolSelect={setActiveTool} />
      <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      <main className="main-content bg-gray-100 dark:bg-slate-950 transition-colors">
        <div className="tool-container">{renderTool()}</div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
