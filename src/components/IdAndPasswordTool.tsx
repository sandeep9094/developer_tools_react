import React, { useState } from "react";
import "./IdAndPasswordTool.css";

const IdAndPasswordToolPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const copyToClipboard = (value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
  };

  const generatePassword = () => {
    let chars = "";
    if (includeLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()-_=+[]{};:,.<>?/";

    if (!chars) {
      setPassword("Select at least one character set");
      return;
    }

    const length = Math.max(4, passwordLength || 16);
    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  const clearAll = () => {
    setPassword("");
  };

  return (
    <div className="idpw-container">
      <div className="idpw-card">
        <div className="idpw-header">
          <div>
            <h1 className="idpw-title">Password Generator</h1>
            <p className="idpw-subtitle">
              Generate secure, random passwords with customizable options.
            </p>
          </div>
          <button className="idpw-btn-reset" onClick={clearAll}>
            Clear
          </button>
        </div>

        <div className="idpw-main-section">
          <div className="idpw-section">
            <div className="idpw-header-row">
              <h2 className="idpw-section-title">Generated Password</h2>
              <div className="idpw-actions">
                <button className="btn-green" onClick={generatePassword}>
                  Generate
                </button>
                <button
                  className="copy-button"
                  disabled={!password}
                  onClick={() => copyToClipboard(password)}
                  title="Copy password"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="idpw-options">
              <label>Length</label>
              <input
                type="number"
                min={4}
                value={passwordLength}
                onChange={(e) =>
                  setPasswordLength(parseInt(e.target.value, 10))
                }
                className="idpw-input-small"
              />

              <label className="idpw-check">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                />{" "}
                lowercase
              </label>

              <label className="idpw-check">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                />{" "}
                UPPERCASE
              </label>

              <label className="idpw-check">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                />{" "}
                numbers
              </label>

              <label className="idpw-check">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                />{" "}
                symbols
              </label>
            </div>

            <div className="idpw-output">
              {password || "Configure options & click Generate"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdAndPasswordToolPage;
