import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Base32Encoding from "./components/Base32Encoding";
import Base64Encoding from "./components/Base64Encoding";
import BaseEncodingPage from "./components/BaseEncodingPage";
import DiffChecker from "./components/DiffChecker";
import LoremIpsumGenerator from "./components/LoremIpsumGenerator";
import ColorPicker from "./components/ColorPicker";
import JsonBeautifierPage from "./components/JsonBeautifier";
import RegexMatcher from "./components/RegexMatcher";
import UlidUuidGenerator from "./components/UlidUuidGenerator";
import IdAndPasswordToolPage from "./components/IdAndPasswordTool";
import JsonDataGenerator from "./components/JsonDataGenerator";
import HashingTool from "./components/HashingTool";
import AesEncryptionTool from "./components/AesEncryptionTool";
import RsaEncryptionTool from "./components/RsaEncryptionTool";
import JsonSchemaValidator from "./components/JsonSchemaValidator";
import JwtDecoder from "./components/JwtDecoder";
import QrGenerator from "./components/QrGenerator";
import CliCommandBreaks from "./components/CliCommandBreaks";
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

      case "base-encoding":
        return <BaseEncodingPage family="both" />;

      case "base32-encode":
      case "base32-decode":
        return <BaseEncodingPage family="base32" />;

      case "base64-encode":
      case "base64-decode":
        return <BaseEncodingPage family="base64" />;

      case "diff-checker":
        return <DiffChecker />;

      case "lorem-ipsum-generator":
        return <LoremIpsumGenerator />;

      case "color-picker":
        return <ColorPicker />;

      case "regex-matcher":
        return <RegexMatcher />;

      case "ulid-uuid-generator":
        return <UlidUuidGenerator />;

      case "id-password-generator":
        return <IdAndPasswordToolPage />;

      case "json-data-generator":
        return <JsonDataGenerator />;

      case "hashing-tool":
        return <HashingTool />;

      case "aes-encryption-tool":
        return <AesEncryptionTool />;

      case "rsa-encryption-tool":
        return <RsaEncryptionTool />;

      case "jwt-decoder":
        return <JwtDecoder />;

      case "qr-generator":
        return <QrGenerator />;

      case "cli-command-breaks":
        return <CliCommandBreaks />;

      case "json-schema-validator":
        return <JsonSchemaValidator />;

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
