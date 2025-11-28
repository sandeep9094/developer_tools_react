import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ulid } from "ulid";
import { nanoid } from "nanoid";
import "./IdAndPasswordTool.css";

const IdAndPasswordToolPage: React.FC = () => {
  const [uuid, setUuid] = useState("");
  const [ulidValue, setUlidValue] = useState("");
  const [nanoId, setNanoId] = useState("");
  const [nanoLength, setNanoLength] = useState(21);

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

  const generateUuid = () => setUuid(uuidv4());
  const generateUlid = () => setUlidValue(ulid());

  const generateNanoId = () => {
    const len = Math.max(4, nanoLength || 21);
    setNanoId(nanoid(len));
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

  return (
    <div className="idpw-container">
      <div className="idpw-card">
        <h1 className="idpw-title">ID & Password Generator</h1>
        <p className="idpw-subtitle">
          Generate UUIDs, ULIDs, Nano IDs and secure passwords.
        </p>

        <div className="idpw-grid">
          {/* UUID */}
          <div className="idpw-section">
            <div className="idpw-header-row">
              <h2 className="idpw-section-title">UUID v4</h2>
              <div className="idpw-actions">
                <button className="btn-primary" onClick={generateUuid}>
                  Generate
                </button>
                <button
                  className="btn-secondary"
                  disabled={!uuid}
                  onClick={() => copyToClipboard(uuid)}
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="idpw-output">{uuid || "Click Generate"}</div>
          </div>

          {/* ULID */}
          <div className="idpw-section">
            <div className="idpw-header-row">
              <h2 className="idpw-section-title">ULID</h2>
              <div className="idpw-actions">
                <button className="btn-primary" onClick={generateUlid}>
                  Generate
                </button>
                <button
                  className="btn-secondary"
                  disabled={!ulidValue}
                  onClick={() => copyToClipboard(ulidValue)}
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="idpw-output">
              {ulidValue || "Click Generate"}
            </div>
          </div>

          {/* NANO ID */}
          <div className="idpw-section">
            <div className="idpw-header-row">
              <h2 className="idpw-section-title">Nano ID</h2>
              <div className="idpw-actions">
                <input
                  type="number"
                  min={4}
                  value={nanoLength}
                  onChange={(e) => setNanoLength(parseInt(e.target.value, 10))}
                  className="idpw-input-small"
                />
                <button className="btn-primary" onClick={generateNanoId}>
                  Generate
                </button>
                <button
                  className="btn-secondary"
                  disabled={!nanoId}
                  onClick={() => copyToClipboard(nanoId)}
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="idpw-output">
              {nanoId || "Set length & click Generate"}
            </div>
          </div>

          {/* PASSWORD GENERATOR */}
          <div className="idpw-section">
            <div className="idpw-header-row">
              <h2 className="idpw-section-title">Password Generator</h2>
              <div className="idpw-actions">
                <button className="btn-green" onClick={generatePassword}>
                  Generate
                </button>
                <button
                  className="btn-secondary"
                  disabled={!password}
                  onClick={() => copyToClipboard(password)}
                >
                  Copy
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
